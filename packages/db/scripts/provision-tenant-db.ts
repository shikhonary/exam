import "dotenv/config";
import { Pool } from "pg";
import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "../src/client";
import path from "path";

const execAsync = promisify(exec);

// ─── Connection String Helpers ────────────────────────────────────────────────

function parseConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  return {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port || "5432",
    database: url.pathname.slice(1),
    sslmode: url.searchParams.get("sslmode") || "require",
    channelBinding: url.searchParams.get("channel_binding") || "",
  };
}

function buildConnectionString(
  user: string,
  password: string,
  host: string,
  port: string,
  database: string,
  sslmode: string,
  channelBinding?: string,
): string {
  let url = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=${sslmode}`;
  if (channelBinding) {
    url += `&channel_binding=${channelBinding}`;
  }
  return url;
}

// ─── Core Provisioning Logic ──────────────────────────────────────────────────

/**
 * Provisions a dedicated PostgreSQL database for a tenant.
 *
 * Flow:
 * 1. Mark tenant as PROVISIONING.
 * 2. Create the database via a raw pg.Pool connected to the "postgres" system DB.
 *    (CREATE DATABASE cannot run inside a transaction or via the Prisma adapter.)
 * 3. Build the tenant connection string.
 * 4. Run `prisma db push` against the new database (async, captures output).
 * 5. Update tenant record: databaseName, connectionString, databaseStatus → ACTIVE.
 *
 * On failure: sets databaseStatus → FAILED and records the reason in suspendReason.
 */
export const provisionTenantDb = async (tenantId: string): Promise<void> => {
  const masterConnectionString = process.env.DATABASE_URL;
  if (!masterConnectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // ── Fetch tenant ──────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error(`Tenant with ID ${tenantId} not found`);
  }

  const tenantDbName = `tenant_${tenant.slug.replace(/-/g, "_")}`;
  const masterConfig = parseConnectionString(masterConnectionString);

  console.log(`\n🚀 Provisioning tenant database...`);
  console.log(`   Tenant  : ${tenant.name} (${tenantId})`);
  console.log(`   Database: ${tenantDbName}`);

  try {
    // ── Step 0: Mark as PROVISIONING ────────────────────────────────────────
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { databaseStatus: "PROVISIONING" },
    });

    // ── Step 1: Create the database via raw pg connected to system DB ────────
    // IMPORTANT: CREATE DATABASE cannot run inside a transaction.
    // We connect to the "postgres" system database, not the app database.
    console.log("\n1️⃣  Creating database...");

    const systemPool = new Pool({
      host: masterConfig.host,
      port: parseInt(masterConfig.port),
      user: masterConfig.user,
      password: masterConfig.password,
      database: "postgres", // system DB — required for CREATE DATABASE
      ssl: { rejectUnauthorized: false },
    });

    try {
      // Check if the database already exists before creating
      const existing = await systemPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [tenantDbName],
      );

      if ((existing.rowCount ?? 0) === 0) {
        // CREATE DATABASE must run outside a transaction — use query() directly
        await systemPool.query(
          `CREATE DATABASE "${tenantDbName}" OWNER "${masterConfig.user}"`,
        );
        console.log("   ✅ Database created successfully");
      } else {
        console.log("   ⚠️  Database already exists, continuing...");
      }
    } finally {
      await systemPool.end();
    }

    // ── Step 2: Build tenant connection string ───────────────────────────────
    const tenantConnectionString = buildConnectionString(
      masterConfig.user,
      masterConfig.password,
      masterConfig.host,
      masterConfig.port,
      tenantDbName,
      masterConfig.sslmode,
      masterConfig.channelBinding,
    );

    // ── Step 3: Run migrations / push schema ─────────────────────────────────
    console.log("\n2️⃣  Running migrations on tenant database...");

    // Resolve paths relative to the monorepo root regardless of cwd
    const rootDir = process.cwd().includes("apps")
      ? path.join(process.cwd(), "../..")
      : process.cwd();

    const schemaPath = path
      .resolve(rootDir, "packages/db/prisma-tenant/schema.prisma")
      .replace(/\\/g, "/");

    const configPath = path
      .resolve(rootDir, "packages/db/prisma-tenant/prisma.config.ts")
      .replace(/\\/g, "/");

    const prismaPath = path
      .resolve(rootDir, "node_modules/.pnpm/prisma@7.2.0_@types+react@1_a99f622586ef03bec06266798856d205/node_modules/prisma/build/index.js")
      .replace(/\\/g, "/");

    const migrateCommand = `node "${prismaPath}" db push --schema "${schemaPath}" --config "${configPath}"`;

    try {
      const { stdout, stderr } = await execAsync(migrateCommand, {
        env: {
          ...process.env,
          DATABASE_URL: tenantConnectionString,
          TENANT_DATABASE_URL: tenantConnectionString,
        },
      });

      if (stdout) console.log(stdout);
      if (stderr && !stderr.toLowerCase().includes("warn")) {
        console.error(stderr);
      }

      console.log("   ✅ Schema pushed successfully");
    } catch (error: any) {
      console.error("   ❌ Migration failed:", error.message);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(error.stderr);
      throw error;
    }

    // ── Step 4: Update tenant record ─────────────────────────────────────────
    console.log("\n3️⃣  Updating tenant record...");

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        databaseName: tenantDbName,
        connectionString: tenantConnectionString,
        databaseStatus: "ACTIVE",
      },
    });

    console.log("   ✅ Tenant record updated");
    console.log(`\n🎉 Tenant "${tenant.name}" provisioned successfully!`);
    console.log(`   Database : ${tenantDbName}`);
    console.log(`   Status   : ACTIVE`);
  } catch (error: any) {
    console.error(`\n❌ Failed to provision tenant database:`, error);

    // Mark as FAILED so the admin knows to retry / investigate
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        databaseStatus: "FAILED",
        suspendReason: `Database provisioning failed: ${error.message}`,
      },
    });

    throw error;
  }
};

// ─── CLI Entry Point ──────────────────────────────────────────────────────────

if (process.argv[2]) {
  provisionTenantDb(process.argv[2])
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

import { prisma } from "../src/client";
import { readFileSync } from "fs";
import { resolve } from "path";

async function seedGeo() {
  console.log("Starting Geo Seeding...");

  // 1. Load Postcode Data (Source: saaiful/postcode-bd)
  const postCodePath = resolve(process.cwd(), "../../scratch/postcode-bd/postcode-pretty.json");
  const postCodeData = JSON.parse(readFileSync(postCodePath, "utf8"));

  // 2. Load Unions Data (Source: nuhil/bangladesh-geocode)
  const unionsPath = resolve(process.cwd(), "../../scratch/bangladesh-geocode/unions/unions.json");
  const unionsRaw = JSON.parse(readFileSync(unionsPath, "utf8"));
  const unionsList = unionsRaw.find((item: any) => item.type === "table" && item.name === "unions").data;

  const upazilasPath = resolve(process.cwd(), "../../scratch/bangladesh-geocode/upazilas/upazilas.json");
  const upazilasRaw = JSON.parse(readFileSync(upazilasPath, "utf8"));
  const upazilasList = upazilasRaw.find((item: any) => item.type === "table" && item.name === "upazilas").data;

  // Clear existing data (Optional, but good for clean seed)
  console.log("Clearing existing geo data...");
  await prisma.union.deleteMany();
  await prisma.postOffice.deleteMany();
  await prisma.upazila.deleteMany();
  await prisma.district.deleteMany();
  await prisma.division.deleteMany();

  // Maps to keep track of created records
  const divisionMap = new Map<string, string>(); // name -> id
  const districtMap = new Map<string, string>(); // name -> id
  const upazilaMap = new Map<string, string>(); // name -> id

  console.log("Processing Divisions, Districts, Upazilas, and Post Offices...");
  
  for (const code in postCodeData) {
    const item = postCodeData[code];
    if (!item.en || !item.bn) continue;

    const divName = item.en.division.trim();
    const divNameBn = item.bn.division.trim();

    // Ensure Division
    let divId = divisionMap.get(divName);
    if (!divId) {
      const div = await prisma.division.create({
        data: { name: divName, nameBn: divNameBn },
      });
      divId = div.id;
      divisionMap.set(divName, divId);
    }

    // Ensure District
    const distName = item.en.district.trim();
    const distNameBn = item.bn.district.trim();
    const distKey = `${divName}:${distName}`;
    let distId = districtMap.get(distKey);
    if (!distId) {
      const dist = await prisma.district.create({
        data: { name: distName, nameBn: distNameBn, divisionId: divId },
      });
      distId = dist.id;
      districtMap.set(distKey, distId);
    }

    // Ensure Upazila
    const upazilaName = item.en.thana.trim();
    const upazilaNameBn = item.bn.thana.trim();
    const upazilaKey = `${distKey}:${upazilaName}`;
    let upazilaId = upazilaMap.get(upazilaKey);
    if (!upazilaId) {
      const upazila = await prisma.upazila.create({
        data: { name: upazilaName, nameBn: upazilaNameBn, districtId: distId },
      });
      upazilaId = upazila.id;
      upazilaMap.set(upazilaKey, upazilaId);
    }

    // Create Post Office
    await prisma.postOffice.create({
      data: {
        name: item.en.suboffice.trim(),
        nameBn: item.bn.suboffice.trim(),
        postCode: item.en.postcode.trim(),
        upazilaId: upazilaId,
      },
    });
  }

  console.log("Processing Unions...");
  // Create a mapping from nuhil upazila ID to our created upazila ID
  const nuhilUpazilaToMasterId = new Map<string, string>();

  for (const nup of upazilasList) {
    const name = nup.name.trim().toLowerCase();
    // Try to find matching upazila in our map
    // We iterate over our map to find a match by name
    for (const [key, id] of upazilaMap.entries()) {
      const parts = key.split(":");
      const masterName = parts[parts.length - 1]!.toLowerCase();
      if (masterName === name || masterName.includes(name) || name.includes(masterName)) {
        nuhilUpazilaToMasterId.set(nup.id, id);
        break;
      }
    }
  }

  // Now create unions
  let unionCount = 0;
  for (const u of unionsList) {
    const masterUpazilaId = nuhilUpazilaToMasterId.get(u.upazilla_id);
    if (masterUpazilaId) {
      await prisma.union.create({
        data: {
          name: u.name.trim(),
          nameBn: u.bn_name.trim(),
          upazilaId: masterUpazilaId,
        },
      });
      unionCount++;
    }
  }

  console.log(`Seed completed! Created ${divisionMap.size} divisions, ${districtMap.size} districts, ${upazilaMap.size} upazilas, ${unionCount} unions.`);
}

seedGeo()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

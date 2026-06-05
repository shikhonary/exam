import { prisma } from "../src/client";
import { readFileSync } from "fs";
import { resolve } from "path";

async function repair() {
  console.log("Starting Geo Data Repair...");

  const upazilasPath = resolve(process.cwd(), "../../scratch/bangladesh-geocode/upazilas/upazilas.json");
  const upazilasRaw = JSON.parse(readFileSync(upazilasPath, "utf8"));
  const sourceUpazilas = upazilasRaw.find((item: any) => item.type === "table" && item.name === "upazilas").data;

  const districtsPath = resolve(process.cwd(), "../../scratch/bangladesh-geocode/districts/districts.json");
  const districtsRaw = JSON.parse(readFileSync(districtsPath, "utf8"));
  const sourceDistricts = districtsRaw.find((item: any) => item.type === "table" && item.name === "districts").data;

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "").trim();
  const englishRegex = /[a-zA-Z]/;

  function levenshtein(a: string, b: string): number {
    const tmp: number[][] = [];
    for (let i = 0; i <= a.length; i++) { tmp[i] = [i]; }
    for (let j = 0; j <= b.length; j++) { tmp[0]![j] = j; }
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        tmp[i]![j] = Math.min(
          tmp[i - 1]![j]! + 1,
          tmp[i]![j - 1]! + 1,
          tmp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return tmp[a.length]![b.length]!;
  }

  const dbUpazilas = await prisma.upazila.findMany();
  let updates = 0;

  for (const u of dbUpazilas) {
    if (englishRegex.test(u.nameBn)) {
      const uNorm = normalize(u.name);
      
      const dbDist = await prisma.district.findUnique({ where: { id: u.districtId } });
      if (!dbDist) continue;

      const distNorm = normalize(dbDist.name);
      const sDist = sourceDistricts.find((d: any) => normalize(d.name) === distNorm);
      if (!sDist) continue;

      const candidates = sourceUpazilas.filter((s: any) => s.district_id === sDist.id);
      
      // Try exact or prefix match first
      let match = candidates.find((s: any) => {
        const sNorm = normalize(s.name);
        return sNorm === uNorm || sNorm.startsWith(uNorm) || uNorm.startsWith(sNorm);
      });

      // If no match, try fuzzy matching
      if (!match) {
        let bestDistance = 999;
        for (const cand of candidates) {
          const dist = levenshtein(uNorm, normalize(cand.name));
          if (dist < bestDistance) {
            bestDistance = dist;
            match = cand;
          }
        }
        // Only accept if distance is small relative to name length
        if (bestDistance > 3) match = null;
      }

      if (match) {
        await prisma.upazila.update({
          where: { id: u.id },
          data: { nameBn: match.bn_name.trim() }
        });
        updates++;
        console.log(`Updated ${u.name} -> ${match.bn_name} (Distance: ${levenshtein(uNorm, normalize(match.name))})`);
      }
    }
  }

  console.log(`Repair completed! Updated ${updates} upazilas.`);
}

repair()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

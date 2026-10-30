import sharp from "sharp"

// Retain the source PNGs so regenerating never compounds a lossy encode.
// These small decorative surfaces previously transferred 132KB per visit.
for (const source of ["public/writings/folder-back", "public/writings/folder-front", "public/logos/boldvoice"]) {
  await sharp(`${source}.png`).webp({ quality: 85 }).toFile(`${source}.webp`)
}

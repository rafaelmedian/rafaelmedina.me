import sharp from "sharp"
const [src, out, deg] = [process.argv[2], process.argv[3], Number(process.argv[4])]
const W = 1067, H = 1600, t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
const k = Math.min(W / (W * c + H * s), H / (W * s + H * c))
const w = Math.floor(W * k / 2) * 2, h = Math.round(w * 1.5)
const rot = await sharp(src).rotate(deg, { background: "#000" }).toBuffer({ resolveWithObject: true })
const left = Math.round((rot.info.width - w) / 2), top = Math.round((rot.info.height - h) / 2)
const cropped = await sharp(rot.data).extract({ left, top, width: w, height: h }).toBuffer()
let img = sharp(cropped)
if (process.argv[5] !== "raw") img = img.gamma(2.2, 1.85).modulate({ brightness: 1.04, saturation: 1.18 }).linear(1.06, -6).sharpen({ sigma: 0.6, m1: 0, m2: 1.2 })
await img.webp({ quality: 90, effort: 6 }).toFile(out)
console.log(w, h)

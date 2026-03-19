const fs = require("fs");
const zlib = require("zlib");

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

function createPNG(size) {
  const w = size, h = size;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  const bgR = 0, bgG = 104, bgB = 71;      // #006847
  const yR = 245, yG = 200, yB = 0;         // #F5C800
  const bR = 0, bG = 48, bB = 130;          // #003082
  const rad = Math.floor(size * 0.19);
  const strH = Math.max(2, Math.floor(size * 0.015));

  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter byte
    for (let x = 0; x < w; x++) {
      const idx = y * (w * 4 + 1) + 1 + x * 4;

      // Rounded corners
      let inside = true;
      if (x < rad && y < rad) inside = Math.hypot(x - rad, y - rad) <= rad;
      else if (x >= w - rad && y < rad) inside = Math.hypot(x - (w - rad), y - rad) <= rad;
      else if (x < rad && y >= h - rad) inside = Math.hypot(x - rad, y - (h - rad)) <= rad;
      else if (x >= w - rad && y >= h - rad) inside = Math.hypot(x - (w - rad), y - (h - rad)) <= rad;

      if (!inside) {
        raw[idx] = 0; raw[idx + 1] = 0; raw[idx + 2] = 0; raw[idx + 3] = 0;
        continue;
      }

      // Yellow top stripe
      if (y < strH) {
        raw[idx] = yR; raw[idx + 1] = yG; raw[idx + 2] = yB; raw[idx + 3] = 255;
        continue;
      }
      // Blue bottom stripe
      if (y >= h - strH) {
        raw[idx] = bR; raw[idx + 1] = bG; raw[idx + 2] = bB; raw[idx + 3] = 255;
        continue;
      }

      // Letter "E" - block style
      const cx = w / 2;
      const cy = h * 0.44;
      const eL = cx - size * 0.24;
      const eR = cx + size * 0.24;
      const eT = cy - size * 0.28;
      const eB = cy + size * 0.18;
      const bar = size * 0.09;

      let letter = false;
      // Left vertical
      if (x >= eL && x <= eL + bar && y >= eT && y <= eB) letter = true;
      // Top horizontal
      if (x >= eL && x <= eR && y >= eT && y <= eT + bar) letter = true;
      // Middle horizontal
      const mY = (eT + eB) / 2 - bar / 2;
      if (x >= eL && x <= eR - size * 0.04 && y >= mY && y <= mY + bar) letter = true;
      // Bottom horizontal
      if (x >= eL && x <= eR && y >= eB - bar && y <= eB) letter = true;

      if (letter) {
        raw[idx] = yR; raw[idx + 1] = yG; raw[idx + 2] = yB; raw[idx + 3] = 255;
      } else {
        raw[idx] = bgR; raw[idx + 1] = bgG; raw[idx + 2] = bgB; raw[idx + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA

  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// Generate all sizes
[48, 192, 512].forEach((size) => {
  const png = createPNG(size);
  const name = size === 48 ? "favicon.png" : `icon-${size}.png`;
  fs.writeFileSync(`public/${name}`, png);
  console.log(`${name} - ${png.length} bytes`);
});

console.log("Done!");

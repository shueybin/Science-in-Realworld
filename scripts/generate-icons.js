import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writePng(width, height, isMaskable = false) {
  // 4 channels RGBA
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = width * (isMaskable ? 0.38 : 0.46);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep scientific indigo/slate background for maskable, dark squircle/circle for any
      let r = 15, g = 23, b = 42, a = 255; // #0f172a

      if (!isMaskable && dist > outerRadius + 2) {
        // Transparent outside circular badge for standard icon
        r = 0; g = 0; b = 0; a = 0;
      } else {
        // Gradient badge
        const t = (y / height);
        // Slate to cyan/emerald gradient
        r = Math.floor(15 + t * 10);
        g = Math.floor(23 + t * 60);
        b = Math.floor(42 + t * 90);

        // Core atom nucleus
        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
        if (distFromCenter < width * 0.1) {
          // Bright cyan glowing nucleus
          r = 56; g = 189; b = 248; // #38bdf8
        } else {
          // Orbit rings
          // Ring 1: tilted 45 deg ellipse
          const rot1X = (dx * 0.707 + dy * 0.707);
          const rot1Y = (-dx * 0.707 + dy * 0.707) * 2.6;
          const distEllipse1 = Math.sqrt(rot1X * rot1X + rot1Y * rot1Y);

          // Ring 2: tilted -45 deg ellipse
          const rot2X = (dx * 0.707 - dy * 0.707);
          const rot2Y = (dx * 0.707 + dy * 0.707) * 2.6;
          const distEllipse2 = Math.sqrt(rot2X * rot2X + rot2Y * rot2Y);

          const rRing = width * 0.28;
          const isRing1 = Math.abs(distEllipse1 - rRing) < (width * 0.02);
          const isRing2 = Math.abs(distEllipse2 - rRing) < (width * 0.02);

          if (isRing1 || isRing2) {
            r = 14; g = 165; b = 233; // Cyan ring
          }

          // Real-world beaker / flask accent at bottom
          if (dy > width * 0.18 && Math.abs(dx) < width * 0.18) {
            r = 16; g = 185; b = 129; // Emerald #10b981
          }
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace: none

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = data.length;
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(len, 0);
    const toCrc = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(toCrc);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), writePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), writePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), writePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), writePng(180, 180, true));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), writePng(48, 48, false));

console.log('PWA PNG and icon assets generated successfully in public/');

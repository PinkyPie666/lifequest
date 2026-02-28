const fs = require("fs");
const zlib = require("zlib");

function createPNG(size) {
  // IHDR chunk data
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  // Image data: purple circle on dark background
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const cx = size / 2, cy = size / 2, r = size * 0.38;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    raw[rowStart] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const off = rowStart + 1 + x * 3;
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < r * 0.6) {
        // Inner: white "LQ" area approximation
        raw[off] = 255; raw[off + 1] = 255; raw[off + 2] = 255;
      } else if (dist < r) {
        // Ring: purple
        raw[off] = 139; raw[off + 1] = 92; raw[off + 2] = 246;
      } else {
        // Background: dark
        raw[off] = 10; raw[off + 1] = 10; raw[off + 2] = 15;
      }
    }
  }

  const deflated = zlib.deflateSync(raw);

  // Build chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type);
    const body = Buffer.concat([typeB, data]);
    const crcVal = zlib.crc32(body);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crcVal >>> 0, 0);
    return Buffer.concat([len, body, crc]);
  }

  const ihdr = makeChunk("IHDR", ihdrData);
  const idat = makeChunk("IDAT", deflated);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

fs.mkdirSync("public/icons", { recursive: true });

[192, 512].forEach((s) => {
  const png = createPNG(s);
  fs.writeFileSync(`public/icons/icon-${s}x${s}.png`, png);
  console.log(`Created icon-${s}x${s}.png (${png.length} bytes)`);
});

// News image entry for 18 November 2026 (Node 22, standard library only).
// The image is drawn once and stored beside this file as entry.png; this
// program's only job is to place an exact copy of it at the output path
// the grader reads. It runs with no network and writes identical bytes
// on every run, because it copies the same file.
//
// The v4 image is a dense 40-story broadsheet (3 heroes, 9 illustrated
// mid stories, 28 briefs, world map with pins), rendered by
// ../news-image-20261118-dev/render.py with PIL. v4 fixes what the
// leaderboard leaders do better than v3: a readable world map (separate
// continents, colour-coded pins, real legend), Voyager 1 promoted from
// a brief to an illustrated mid story (Kerch bridge becomes brief 14),
// a "day in numbers" stat strip under the map, bold lead-ins on the
// briefs, source labels where the body names one, one tight halo
// instead of fried-egg glow rings, and the Waymo/GTA/summit/Senate
// thumb glitches fixed. Same 40 verified stories, same facts.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
// v4 render sha256 (verified deterministic — two consecutive renders
// of ../news-image-20261118-dev/render.py produce identical bytes):
// d6fca285cdf35413ff571a4fa8b66cfc722643021320661d9f778f9f0e80d695
const source = new URL("./entry.png", import.meta.url);
const dest = join(outDir, "entry.png");
// The grader's output directory may not exist yet; create it first.
mkdirSync(outDir, { recursive: true });
// Guard: the entry must be a 1024x1024 PNG. Read the IHDR chunk
// (bytes 16-24: width then height, big-endian uint32) and refuse to
// copy anything else, so a wrong-size image can never be submitted.
const srcBytes = readFileSync(source);
// Guard: the entry must really be a PNG, not just a file named .png.
// Check the 8-byte PNG magic signature before trusting the IHDR below.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!srcBytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error("entry.png does not start with the PNG signature");
}
const width = srcBytes.readUInt32BE(16);
const height = srcBytes.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png is ${width}x${height}, expected 1024x1024`);
}
copyFileSync(source, dest);
const dstBytes = readFileSync(dest);
const sha256 = (b) => createHash("sha256").update(b).digest("hex");
if (srcBytes.length !== dstBytes.length || sha256(srcBytes) !== sha256(dstBytes)) {
  throw new Error(
    `entry.png copy mismatch: ${dstBytes.length} of ${srcBytes.length} bytes`
  );
}

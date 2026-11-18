// News image entry for 18 November 2026 (Node 22, standard library only).
// The image is drawn once and stored beside this file as entry.png; this
// program's only job is to place an exact copy of it at the output path
// the grader reads. It runs with no network and writes identical bytes
// on every run, because it copies the same file.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const source = new URL("./entry.png", import.meta.url);
const dest = join(outDir, "entry.png");
// The grader's output directory may not exist yet; create it first.
mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);
// Verify the copy is exact: same byte count AND same SHA-256 as the source,
// so a same-size but corrupted copy can never pass as a good one.
const srcBytes = readFileSync(source);
const dstBytes = readFileSync(dest);
const sha256 = (b) => createHash("sha256").update(b).digest("hex");
if (srcBytes.length !== dstBytes.length || sha256(srcBytes) !== sha256(dstBytes)) {
  throw new Error(
    `entry.png copy mismatch: ${dstBytes.length} of ${srcBytes.length} bytes`
  );
}

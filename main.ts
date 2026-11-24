// News-image entry runner (news-image-20261124, Node 22, stdlib only).
// The picture lives in this repo as entry.png. This script checks that it
// is a genuine PNG inside the size limits, then writes its bytes to the
// output folder the grader reads (/output/entry.png, or MAKEFUN_OUTPUT_DIR).
// Tuesday 24 November 2026 in one image: 39 stories, 6 regions + global.
// The picture was drawn elsewhere from a verified story list; this script
// only validates the bytes and delivers them unchanged. No network.
// Bytes are read and written out fresh (never copyFileSync), so the output
// file always gets normal write permissions on the grader's side.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_HEAD = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const BYTE_LIMIT = 1024 * 1024;
const SIDE_LIMIT = 1024;

function die(why: string): never {
  throw new Error(`entry.png rejected: ${why}`);
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const source = join(repoDir, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const target = join(outDir, 'entry.png');

const bytes = readFileSync(source);
if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_HEAD)) die('not a PNG file');
if (bytes.length > BYTE_LIMIT) die(`too large: ${bytes.length} bytes`);
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > SIDE_LIMIT || height > SIDE_LIMIT) die(`too big: ${width}x${height}`);
mkdirSync(outDir, { recursive: true });
writeFileSync(target, bytes);
console.log(`entry.png -> ${target} (${bytes.length} bytes, ${width}x${height})`);

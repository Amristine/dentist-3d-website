import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { inflateRawSync } from "node:zlib";

const root = process.cwd();
const archivePath = join(root, "assets", "dentora-original-image-assets.zip");

let archive;
try {
  archive = await readFile(archivePath);
} catch (error) {
  if (error?.code === "ENOENT") {
    console.warn(
      "Original dental image pack not found. Upload assets/dentora-original-image-assets.zip to enable the supplied full-resolution images."
    );
    process.exit(0);
  }
  throw error;
}

function findEndOfCentralDirectory(buffer) {
  const min = Math.max(0, buffer.length - 22 - 0xffff);
  for (let offset = buffer.length - 22; offset >= min; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  throw new Error("Invalid image pack: ZIP directory footer not found.");
}

const eocd = findEndOfCentralDirectory(archive);
const entryCount = archive.readUInt16LE(eocd + 10);
let directoryOffset = archive.readUInt32LE(eocd + 16);
const publicRoot = resolve(root, "public") + sep;
let written = 0;

for (let index = 0; index < entryCount; index += 1) {
  if (archive.readUInt32LE(directoryOffset) !== 0x02014b50) {
    throw new Error("Invalid image pack: malformed ZIP directory entry.");
  }

  const flags = archive.readUInt16LE(directoryOffset + 8);
  const method = archive.readUInt16LE(directoryOffset + 10);
  const compressedSize = archive.readUInt32LE(directoryOffset + 20);
  const uncompressedSize = archive.readUInt32LE(directoryOffset + 24);
  const nameLength = archive.readUInt16LE(directoryOffset + 28);
  const extraLength = archive.readUInt16LE(directoryOffset + 30);
  const commentLength = archive.readUInt16LE(directoryOffset + 32);
  const localHeaderOffset = archive.readUInt32LE(directoryOffset + 42);
  const nameStart = directoryOffset + 46;
  const archiveName = archive.subarray(nameStart, nameStart + nameLength).toString("utf8");

  directoryOffset = nameStart + nameLength + extraLength + commentLength;

  if (!archiveName.startsWith("public/images/") || archiveName.endsWith("/")) continue;
  if (archiveName.split("/").some((part) => part === "..")) {
    throw new Error("Unsafe image path in archive: " + archiveName);
  }
  if (!/\.(?:webp|png|jpe?g|svg)$/i.test(archiveName)) continue;
  if (flags & 0x1) throw new Error("Encrypted ZIP entries are not supported: " + archiveName);

  if (archive.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    throw new Error("Invalid local ZIP header for " + archiveName);
  }
  const localNameLength = archive.readUInt16LE(localHeaderOffset + 26);
  const localExtraLength = archive.readUInt16LE(localHeaderOffset + 28);
  const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
  const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
  let fileBytes;

  if (method === 0) fileBytes = Buffer.from(compressed);
  else if (method === 8) fileBytes = inflateRawSync(compressed);
  else throw new Error("Unsupported ZIP compression method " + method + " for " + archiveName);

  if (fileBytes.length !== uncompressedSize) {
    throw new Error("Image size verification failed for " + archiveName);
  }

  const relativePath = archiveName.slice("public/".length);
  const targetPath = resolve(root, "public", relativePath);
  if (!targetPath.startsWith(publicRoot)) throw new Error("Unsafe output path: " + archiveName);

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, fileBytes);
  written += 1;
  process.stdout.write("Restored " + archiveName + " (" + fileBytes.length + " bytes)\n");
}

if (written === 0) {
  throw new Error("The image pack did not contain any supported public/images assets.");
}
process.stdout.write("Restored " + written + " supplied image assets without resizing or recompressing them.\n");

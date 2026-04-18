import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readText(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export async function writeText(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function writeIfMissing(filePath: string, content: string): Promise<void> {
  if (!(await fileExists(filePath))) {
    await writeText(filePath, content);
  }
}

export async function appendText(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.appendFile(filePath, content, "utf8");
}

export async function listFiles(patterns: string | string[], cwd: string): Promise<string[]> {
  return fg(patterns, {
    cwd,
    absolute: true,
    onlyFiles: true,
  });
}

export function toPosix(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
  await ensureDir(path.dirname(destinationPath));
  await fs.copyFile(sourcePath, destinationPath);
}

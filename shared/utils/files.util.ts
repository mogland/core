import { lookup } from "mime-types";
import { fs, path } from "zx-cjs";

export function convertFileSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
}

export function getFileInfo(filePath: string) {
  const stats = fs.statSync(filePath);
  const isDirectory = stats.isDirectory();
  const name = path.basename(filePath);
  const type = isDirectory ? 'directory' : getFileType(filePath);
  const size = isDirectory ? '-' : convertFileSize(stats.size);
  return { name, type, size };
}

export function getFileType(filePath: string) {
  const mimeType = lookup(filePath);
  if (mimeType && mimeType.startsWith('image')) {
    return 'image';
  } else if (mimeType && mimeType.startsWith('audio')) {
    return 'audio';
  } else if (mimeType && mimeType.startsWith('text')) {
    return 'document';
  } else {
    return 'other';
  }
}
export interface NPMFiles {
  files: FilesClass;
  totalSize: number;
  fileCount: number;
  shasum: string;
  integrity: string;
}

export interface FilesClass {
  [filename: string]: License;
}

export interface License {
  size: number;
  type: string;
  path: string;
  contentType: string;
  hex: string;
  isBinary: string;
  linesCount: number;
}

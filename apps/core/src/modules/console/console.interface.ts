export interface getPackageIntoInterface {
  version: string;
  packages: getPackageIntoFiles[];
}

export interface getPackageIntoFiles {
  name: string;
  url: string;
  type: string;
}

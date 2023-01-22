export interface getPackageIntoInterface {
  version: string;
  packages: {
    name: string;
    url: string;
    type: string;
  }[];
}

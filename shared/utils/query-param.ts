export function getValueFromQuery<T>(
  query: { [key: string]: string },
  key: string,
  defaultValue?: T,
): T extends undefined ? string | undefined : string | T {
  return (query[key] as any) || defaultValue;
}

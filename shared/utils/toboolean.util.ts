export function toBoolean(value: any) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    switch (value.toLowerCase()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
        return false;
      default:
        return Boolean(value);
    }
  }
  return Boolean(value);
}

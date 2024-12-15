export default function hasOtherFields<T extends Record<string, any>>(
  data: T,
  excludedFields: string[]
): boolean {
  return Object.keys(data).some(key => !excludedFields.includes(key));
}

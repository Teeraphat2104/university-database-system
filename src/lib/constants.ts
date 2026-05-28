export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

export function getYears(back = 30): number[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: back }, (_, i) => currentYear - i)
}

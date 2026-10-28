export function formatUsd(cents: number): string {
  const value = (Math.round(cents) / 100).toFixed(2).replace('.', ',')
  return `$${value}`
}

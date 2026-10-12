export function parseMoneyInput(value: string): number {
  const parsed = Number(value.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

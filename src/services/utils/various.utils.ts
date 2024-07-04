export function pickRandom<T>(items: Array<T>): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function formatCash(num: number) {
  if (num < 10_000) {
    return `${num}`;
  }

  if (num >= 10_000) {
    return +(num / 1_000).toFixed(1) + 'K';
  }
}

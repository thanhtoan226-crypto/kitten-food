const nf = new Intl.NumberFormat('vi-VN');

/** 160000 -> "160,000 ₫" */
export function formatVND(amount: number): string {
  return `${nf.format(Math.round(amount))} ₫`;
}

/** 16000 -> "16,000 ₫/kg" */
export function formatUnitPrice(amount: number, unit: string): string {
  return `${formatVND(amount)}/${unit}`;
}

/** 0.125 -> "12.5%" */
export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

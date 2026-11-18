import type { Purchase } from '../types';
import {
  CATEGORIES,
  normalizedQuantity,
  normalizedUnitPrice,
  standardUnitLabel,
} from './units';

export interface PriceStats {
  count: number;
  min: number;
  avg: number;
  max: number;
  last: number;
  /** ratio of `value` vs avg, e.g. 1.1 = 10% above average */
}

export function computePriceStats(prices: number[]): Omit<PriceStats, 'last'> | null {
  if (prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return { count: prices.length, min, avg, max };
}

/** Historical unit-price stats for purchases matching a filter */
export function historicalStats(purchases: Purchase[]): {
  count: number;
  min: number;
  avg: number;
  max: number;
} | null {
  const prices = purchases.map(normalizedUnitPrice);
  return computePriceStats(prices);
}

export type DealVerdict = 'good' | 'normal' | 'overpriced' | 'no-data';

/**
 * Compare a prospective normalized unit price against history.
 * - good: at or below historical average
 * - normal: above average but within min–max
 * - overpriced: above historical max
 * - no-data: no matching history
 */
export function evaluateDeal(
  prospectiveUnitPrice: number,
  history: { min: number; avg: number; max: number } | null,
): { verdict: DealVerdict; diffVsAvg: number } {
  if (!history) return { verdict: 'no-data', diffVsAvg: 0 };
  const diffVsAvg = history.avg > 0 ? prospectiveUnitPrice / history.avg - 1 : 0;
  if (prospectiveUnitPrice <= history.avg) return { verdict: 'good', diffVsAvg };
  if (prospectiveUnitPrice <= history.max) return { verdict: 'normal', diffVsAvg };
  return { verdict: 'overpriced', diffVsAvg };
}

export interface RangeRow {
  key: string;
  label: string;
  categoryId: Purchase['categoryId'];
  brand: string;
  product: string;
  count: number;
  min: number;
  avg: number;
  max: number;
  last: number;
  lastDate: string;
  unit: string;
}

function rowKey(p: Purchase, by: 'product' | 'brand'): string {
  return by === 'product' ? `${p.brand}::${p.product}` : p.brand;
}

function rowLabel(p: Purchase, by: 'product' | 'brand'): string {
  return by === 'product' ? p.product : p.brand;
}

/** Min/avg/max normalized unit price grouped by product or brand */
export function buildRangeRows(
  purchases: Purchase[],
  by: 'product' | 'brand',
): RangeRow[] {
  const groups = new Map<string, Purchase[]>();
  for (const p of purchases) {
    const key = rowKey(p, by);
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }

  const rows: RangeRow[] = [];
  for (const [key, items] of groups) {
    const prices = items.map(normalizedUnitPrice);
    const stats = computePriceStats(prices);
    if (!stats) continue;
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const lastPurchase = sorted[sorted.length - 1];
    const first = items[0];
    rows.push({
      key,
      label: rowLabel(first, by),
      categoryId: first.categoryId,
      brand: first.brand,
      product: first.product,
      count: items.length,
      min: stats.min,
      avg: stats.avg,
      max: stats.max,
      last: normalizedUnitPrice(lastPurchase),
      lastDate: lastPurchase.date,
      unit: standardUnitLabel(first.categoryId),
    });
  }
  return rows.sort((a, b) => a.avg - b.avg);
}

export function totalSpend(purchases: Purchase[]): number {
  return purchases.reduce((s, p) => s + p.totalPrice, 0);
}

export interface SpendByKey {
  key: string;
  label: string;
  total: number;
}

export function spendByCategory(purchases: Purchase[]): SpendByKey[] {
  const map = new Map<string, number>();
  for (const p of purchases) {
    map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + p.totalPrice);
  }
  return [...map.entries()]
    .map(([key, total]) => ({ key, label: CATEGORIES[key as Purchase['categoryId']].label, total }))
    .sort((a, b) => b.total - a.total);
}

export function spendByBrand(purchases: Purchase[]): SpendByKey[] {
  const map = new Map<string, number>();
  for (const p of purchases) map.set(p.brand, (map.get(p.brand) ?? 0) + p.totalPrice);
  return [...map.entries()]
    .map(([key, total]) => ({ key, label: key, total }))
    .sort((a, b) => b.total - a.total);
}

/** Normalized quantity purchased (in standard units) for reference */
export function totalNormalizedQty(purchases: Purchase[]): number {
  return purchases.reduce((s, p) => s + normalizedQuantity(p), 0);
}

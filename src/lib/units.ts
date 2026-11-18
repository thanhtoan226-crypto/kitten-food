import type { CategoryDef, CategoryId, Purchase, UnitDef } from '../types';

/**
 * Configurable category + unit conversion definitions.
 * To change a conversion (e.g. 1 gói = 0.4 kg), edit the factor here —
 * or later move this into Firestore/Supabase settings.
 */
export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  kibble: {
    id: 'kibble',
    label: 'Kibble (Hạt)',
    standardUnit: 'kg',
    units: [
      { id: 'kg', label: 'kg', factor: 1 },
      { id: 'goi', label: 'gói', factor: 0.5 }, // 1 gói = 0.5 kg (20 gói = 10 kg)
      { id: 'bao', label: 'bao 5kg', factor: 5 },
      { id: 'tui', label: 'túi 2kg', factor: 2 },
    ],
  },
  pate: {
    id: 'pate',
    label: 'Pate',
    standardUnit: 'gói',
    units: [
      { id: 'goi', label: 'gói', factor: 1 },
      { id: 'lon', label: 'lon', factor: 1 },
      { id: 'hop', label: 'hộp 12', factor: 12 },
    ],
  },
  litter: {
    id: 'litter',
    label: 'Cat Litter (Cát)',
    standardUnit: 'kg',
    units: [
      { id: 'kg', label: 'kg', factor: 1 },
      { id: 'lit', label: 'lít', factor: 0.5 }, // ~0.5 kg per litre
    ],
  },
  treats: {
    id: 'treats',
    label: 'Treats (Súp thưởng)',
    standardUnit: 'thanh',
    units: [
      { id: 'thanh', label: 'thanh', factor: 1 },
      { id: 'tui', label: 'túi 10', factor: 10 },
      { id: 'goi', label: 'gói 15', factor: 15 },
    ],
  },
};

export const CATEGORY_LIST: CategoryDef[] = Object.values(CATEGORIES);

export function getUnit(categoryId: CategoryId, unitId: string): UnitDef {
  return (
    CATEGORIES[categoryId].units.find((u) => u.id === unitId) ??
    CATEGORIES[categoryId].units[0]
  );
}

/** Quantity converted to the category's standard unit */
export function normalizedQuantity(p: Purchase): number {
  return p.quantity * getUnit(p.categoryId, p.unitId).factor;
}

/** Normalized unit price in VND per standard unit */
export function normalizedUnitPrice(p: Purchase): number {
  const qty = normalizedQuantity(p);
  return qty > 0 ? p.totalPrice / qty : 0;
}

export function standardUnitLabel(categoryId: CategoryId): string {
  return CATEGORIES[categoryId].standardUnit;
}

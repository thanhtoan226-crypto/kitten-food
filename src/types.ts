export type CategoryId = 'kibble' | 'pate' | 'litter' | 'treats';

export interface UnitDef {
  id: string;
  label: string;
  /** Multiplier to convert 1 of this unit into the category standard unit */
  factor: number;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  /** Label of the normalized standard unit, e.g. 'kg', 'gói', 'thanh' */
  standardUnit: string;
  units: UnitDef[];
}

export interface Purchase {
  id: string;
  /** ISO date string yyyy-mm-dd */
  date: string;
  categoryId: CategoryId;
  brand: string;
  product: string;
  /** Raw quantity as entered by the user */
  quantity: number;
  /** Unit id within the category's unit list */
  unitId: string;
  /** Total amount paid, in VND */
  totalPrice: number;
}

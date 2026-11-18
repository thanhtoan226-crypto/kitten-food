import { useCallback, useMemo, useState } from 'react';
import type { CategoryId, Purchase } from '../types';
import { SEED_CATALOG, type Catalog } from '../lib/catalog';
import { SEED_PURCHASES } from '../lib/mockData';

/**
 * Data-access layer.
 *
 * Everything the UI needs is exposed through this hook. Today it is backed by
 * in-memory seed data; to connect Firebase/Supabase later, replace the bodies
 * of addPurchase/updatePurchase/deletePurchase/addBrand/addProduct (and the
 * initial state) with remote calls — components won't need to change.
 */
export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(SEED_PURCHASES);
  const [catalog, setCatalog] = useState<Catalog>(SEED_CATALOG);

  const addPurchase = useCallback((purchase: Omit<Purchase, 'id'>) => {
    setPurchases((prev) => [
      ...prev,
      { ...purchase, id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    ]);
  }, []);

  const updatePurchase = useCallback((id: string, patch: Partial<Omit<Purchase, 'id'>>) => {
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deletePurchase = useCallback((id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addBrand = useCallback((categoryId: CategoryId, brand: string) => {
    setCatalog((prev) => {
      const list = prev[categoryId];
      if (list.some((b) => b.brand.toLowerCase() === brand.toLowerCase())) return prev;
      return { ...prev, [categoryId]: [...list, { brand, products: [] }] };
    });
  }, []);

  const addProduct = useCallback((categoryId: CategoryId, brand: string, product: string) => {
    setCatalog((prev) => {
      const list = prev[categoryId].map((b) =>
        b.brand === brand
          ? {
              ...b,
              products: b.products.some((p) => p.toLowerCase() === product.toLowerCase())
                ? b.products
                : [...b.products, product],
            }
          : b,
      );
      return { ...prev, [categoryId]: list };
    });
  }, []);

  const brandsFor = useCallback(
    (categoryId: CategoryId) => catalog[categoryId].map((b) => b.brand),
    [catalog],
  );

  const productsFor = useCallback(
    (categoryId: CategoryId, brand: string) =>
      catalog[categoryId].find((b) => b.brand === brand)?.products ?? [],
    [catalog],
  );

  return useMemo(
    () => ({
      purchases,
      catalog,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addBrand,
      addProduct,
      brandsFor,
      productsFor,
    }),
    [
      purchases,
      catalog,
      addPurchase,
      updatePurchase,
      deletePurchase,
      addBrand,
      addProduct,
      brandsFor,
      productsFor,
    ],
  );
}

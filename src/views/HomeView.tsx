import { useState } from 'react';
import type { Purchase } from '../types';
import { PriceChecker } from '../components/PriceChecker';
import { PurchaseHistory } from '../components/PurchaseHistory';
import { PurchaseForm } from '../components/PurchaseForm';
import type { usePurchases } from '../hooks/usePurchases';

type Store = ReturnType<typeof usePurchases>;

interface Props {
  store: Store;
  isOwner: boolean;
}

export function HomeView({ store, isOwner }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Purchase | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (p: Purchase) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = (data: Omit<Purchase, 'id'>, id?: string) => {
    if (id) store.updatePurchase(id, data);
    else store.addPurchase(data);
  };

  return (
    <div className="space-y-4">
      <PriceChecker
        purchases={store.purchases}
        brandsFor={store.brandsFor}
        productsFor={store.productsFor}
      />
      <PurchaseHistory
        purchases={store.purchases}
        isOwner={isOwner}
        brandsFor={store.brandsFor}
        productsFor={store.productsFor}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={store.deletePurchase}
      />
      <PurchaseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        isOwner={isOwner}
        brandsFor={store.brandsFor}
        productsFor={store.productsFor}
        onAddBrand={store.addBrand}
        onAddProduct={store.addProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

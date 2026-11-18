import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { CategoryId, Purchase } from '../types';
import { CATEGORIES, getUnit } from '../lib/units';
import { formatUnitPrice, formatVND } from '../lib/format';

interface Props {
  open: boolean;
  onClose: () => void;
  /** When set, the form edits this purchase instead of creating one */
  editing?: Purchase | null;
  isOwner: boolean;
  brandsFor: (c: CategoryId) => string[];
  productsFor: (c: CategoryId, b: string) => string[];
  onAddBrand: (c: CategoryId, brand: string) => void;
  onAddProduct: (c: CategoryId, brand: string, product: string) => void;
  onSubmit: (data: Omit<Purchase, 'id'>, id?: string) => void;
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none';
const labelCls = 'mb-1 block text-xs font-medium text-slate-600';

export function PurchaseForm({
  open,
  onClose,
  editing,
  isOwner,
  brandsFor,
  productsFor,
  onAddBrand,
  onAddProduct,
  onSubmit,
}: Props) {
  const [categoryId, setCategoryId] = useState<CategoryId>('kibble');
  const [brand, setBrand] = useState('');
  const [product, setProduct] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [qty, setQty] = useState('');
  const [unitId, setUnitId] = useState('kg');
  const [price, setPrice] = useState('');

  const category = CATEGORIES[categoryId];
  const brands = brandsFor(categoryId);
  const products = brand ? productsFor(categoryId, brand) : [];

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setCategoryId(editing.categoryId);
      setBrand(editing.brand);
      setProduct(editing.product);
      setDate(editing.date);
      setQty(String(editing.quantity));
      setUnitId(editing.unitId);
      setPrice(String(editing.totalPrice));
    } else {
      setCategoryId('kibble');
      setBrand('');
      setProduct('');
      setDate(new Date().toISOString().slice(0, 10));
      setQty('');
      setUnitId(CATEGORIES.kibble.units[0].id);
      setPrice('');
    }
    setNewBrand('');
    setNewProduct('');
  }, [open, editing]);

  if (!open) return null;

  const qtyNum = parseFloat(qty) || 0;
  const priceNum = parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  const factor = getUnit(categoryId, unitId).factor;
  const normQty = qtyNum * factor;
  const unitPrice = normQty > 0 ? priceNum / normQty : 0;

  const canSubmit =
    !!brand && !!product && !!date && qtyNum > 0 && priceNum > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(
      {
        date,
        categoryId,
        brand,
        product,
        quantity: qtyNum,
        unitId,
        totalPrice: priceNum,
      },
      editing?.id,
    );
    onClose();
  };

  const addBrand = () => {
    const b = newBrand.trim();
    if (!b) return;
    onAddBrand(categoryId, b);
    setBrand(b);
    setProduct('');
    setNewBrand('');
  };

  const addProduct = () => {
    const pr = newProduct.trim();
    if (!brand || !pr) return;
    onAddProduct(categoryId, brand, pr);
    setProduct(pr);
    setNewProduct('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
      <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-xl sm:max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            {editing ? 'Sửa giao dịch' : 'Thêm giao dịch mua'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {!isOwner && (
          <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Bạn đang ở Viewer mode — chuyển sang Owner để chỉnh sửa.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Danh mục</label>
            <select
              className={inputCls}
              value={categoryId}
              disabled={!isOwner}
              onChange={(e) => {
                const c = e.target.value as CategoryId;
                setCategoryId(c);
                setBrand('');
                setProduct('');
                setUnitId(CATEGORIES[c].units[0].id);
              }}
            >
              {Object.values(CATEGORIES).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Ngày mua</label>
            <input
              type="date"
              className={inputCls}
              value={date}
              disabled={!isOwner}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Thương hiệu</label>
            <select
              className={inputCls}
              value={brand}
              disabled={!isOwner}
              onChange={(e) => {
                setBrand(e.target.value);
                setProduct('');
              }}
            >
              <option value="">— Chọn —</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tên sản phẩm</label>
            <select
              className={inputCls}
              value={product}
              disabled={!isOwner || !brand}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="">— Chọn —</option>
              {products.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {isOwner && (
            <>
              <div>
                <label className={labelCls}>Thêm thương hiệu mới</label>
                <div className="flex gap-1.5">
                  <input
                    className={inputCls}
                    placeholder="Tên brand..."
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                  />
                  <button
                    onClick={addBrand}
                    className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                    title="Thêm thương hiệu"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Thêm sản phẩm mới</label>
                <div className="flex gap-1.5">
                  <input
                    className={inputCls}
                    placeholder={brand ? `Cho ${brand}...` : 'Chọn brand trước'}
                    value={newProduct}
                    disabled={!brand}
                    onChange={(e) => setNewProduct(e.target.value)}
                  />
                  <button
                    onClick={addProduct}
                    disabled={!brand}
                    className="shrink-0 rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                    title="Thêm sản phẩm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className={labelCls}>Số lượng</label>
            <input
              type="number"
              min="0"
              step="any"
              className={inputCls}
              placeholder="VD: 10"
              value={qty}
              disabled={!isOwner}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Đơn vị nhập</label>
            <select
              className={inputCls}
              value={unitId}
              disabled={!isOwner}
              onChange={(e) => setUnitId(e.target.value)}
            >
              {category.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                  {u.factor !== 1 ? ` (= ${u.factor} ${category.standardUnit})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Tổng tiền (VND)</label>
            <input
              type="text"
              inputMode="numeric"
              className={inputCls}
              placeholder="VD: 80000"
              value={price}
              disabled={!isOwner}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Live conversion preview */}
        {(qtyNum > 0 || priceNum > 0) && (
          <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm">
            <p className="font-medium text-emerald-800">
              {normQty.toLocaleString('vi-VN')} {category.standardUnit}
              {unitPrice > 0 && ` · ${formatUnitPrice(unitPrice, category.standardUnit)}`}
            </p>
            <p className="text-xs text-emerald-700">
              {qtyNum} {getUnit(categoryId, unitId).label} × hệ số {factor} ={' '}
              {normQty.toLocaleString('vi-VN')} {category.standardUnit}
              {priceNum > 0 && ` · ${formatVND(priceNum)} / ${normQty.toLocaleString('vi-VN')} ${category.standardUnit}`}
            </p>
          </div>
        )}

        {isOwner && (
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {editing ? 'Lưu thay đổi' : 'Lưu giao dịch'}
          </button>
        )}
      </div>
    </div>
  );
}

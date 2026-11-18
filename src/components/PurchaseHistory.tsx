import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { CategoryId, Purchase } from '../types';
import { CATEGORIES, getUnit, normalizedQuantity, normalizedUnitPrice, standardUnitLabel } from '../lib/units';
import { formatDate, formatUnitPrice, formatVND } from '../lib/format';

interface Props {
  purchases: Purchase[];
  isOwner: boolean;
  brandsFor: (c: CategoryId) => string[];
  productsFor: (c: CategoryId, b: string) => string[];
  onAdd: () => void;
  onEdit: (p: Purchase) => void;
  onDelete: (id: string) => void;
}

const selectCls =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none';

export function PurchaseHistory({
  purchases,
  isOwner,
  brandsFor,
  productsFor,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [categoryId, setCategoryId] = useState<CategoryId | ''>('');
  const [brand, setBrand] = useState('');
  const [product, setProduct] = useState('');

  const brands = categoryId ? brandsFor(categoryId) : [];
  const products = categoryId && brand ? productsFor(categoryId, brand) : [];

  const filtered = useMemo(
    () =>
      purchases
        .filter(
          (p) =>
            (!categoryId || p.categoryId === categoryId) &&
            (!brand || p.brand === brand) &&
            (!product || p.product === product),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [purchases, categoryId, brand, product],
  );

  return (
    <section className="rounded-2xl bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
        <h2 className="mr-auto text-base font-semibold text-slate-800">Lịch sử mua hàng</h2>

        <select
          className={selectCls}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value as CategoryId | '');
            setBrand('');
            setProduct('');
          }}
        >
          <option value="">Tất cả danh mục</option>
          {Object.values(CATEGORIES).map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            setProduct('');
          }}
          disabled={!categoryId}
        >
          <option value="">Tất cả thương hiệu</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className={selectCls}
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          disabled={!brand}
        >
          <option value="">Tất cả sản phẩm</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {isOwner && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={16} /> Thêm
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="p-8 text-center text-sm text-slate-400">Chưa có giao dịch nào.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Thương hiệu</th>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-right">SL nhập</th>
                  <th className="px-4 py-3 text-right">Tổng tiền</th>
                  <th className="px-4 py-3 text-right">SL chuẩn</th>
                  <th className="px-4 py-3 text-right">Đơn giá chuẩn</th>
                  {isOwner && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cat = CATEGORIES[p.categoryId];
                  const unit = getUnit(p.categoryId, p.unitId);
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">{formatDate(p.date)}</td>
                      <td className="px-4 py-2.5 text-slate-700">{cat.label}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{p.brand}</td>
                      <td className="px-4 py-2.5 text-slate-700">{p.product}</td>
                      <td className="px-4 py-2.5 text-right text-slate-700">
                        {p.quantity.toLocaleString('vi-VN')} {unit.label}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-800">
                        {formatVND(p.totalPrice)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-700">
                        {normalizedQuantity(p).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}{' '}
                        {standardUnitLabel(p.categoryId)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                          {formatUnitPrice(normalizedUnitPrice(p), cat.standardUnit)}
                        </span>
                      </td>
                      {isOwner && (
                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => onEdit(p)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title="Sửa"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onDelete(p.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Xoá"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-3 md:hidden">
            {filtered.map((p) => {
              const cat = CATEGORIES[p.categoryId];
              const unit = getUnit(p.categoryId, p.unitId);
              return (
                <div key={p.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {p.product}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(p.date)} · {cat.label} · {p.brand}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
                      {formatUnitPrice(normalizedUnitPrice(p), cat.standardUnit)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>
                      Nhập: {p.quantity.toLocaleString('vi-VN')} {unit.label}
                    </span>
                    <span>
                      Chuẩn:{' '}
                      {normalizedQuantity(p).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}{' '}
                      {cat.standardUnit}
                    </span>
                    <span className="font-medium text-slate-800">
                      {formatVND(p.totalPrice)}
                    </span>
                  </div>
                  {isOwner && (
                    <div className="mt-2 flex justify-end gap-1 border-t border-slate-50 pt-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                      >
                        <Pencil size={13} /> Sửa
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={13} /> Xoá
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

import { useMemo, useState } from 'react';
import { Check, Copy, Link2, X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
  onToggleMode: () => void;
}

/** Mock "Share (Read-Only)" modal — generates a shareable link and lets the
 *  owner preview Viewer (read-only) vs Owner mode. */
export function ShareModal({ open, onClose, isOwner, onToggleMode }: Props) {
  const [copied, setCopied] = useState(false);
  const link = useMemo(
    () => `${window.location.origin}/share/${Math.random().toString(36).slice(2, 10)}`,
    [],
  );
  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Link2 size={18} className="text-emerald-600" /> Chia sẻ (chỉ xem)
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <p className="mb-3 text-sm text-slate-600">
          Bất kỳ ai có liên kết đều có thể <strong>xem</strong> lịch sử mua sắm —
          họ không thể thêm, sửa hay xoá.
        </p>

        <div className="mb-4 flex gap-2">
          <input
            readOnly
            value={link}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Đã chép' : 'Chép'}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Xem trước chế độ
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => !isOwner && onToggleMode()}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                isOwner
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Owner (chỉnh sửa)
            </button>
            <button
              onClick={() => isOwner && onToggleMode()}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                !isOwner
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Viewer (chỉ xem)
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {isOwner
              ? 'Bạn đang ở Owner mode — có thể thêm/sửa/xoá.'
              : 'Viewer mode — mọi thao tác chỉnh sửa sẽ bị ẩn, giống người dùng mở link chia sẻ.'}
          </p>
        </div>
      </div>
    </div>
  );
}

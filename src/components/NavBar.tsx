import { Cat, LayoutDashboard, PackagePlus } from 'lucide-react';

export type View = 'home' | 'analytics';

interface Props {
  view: View;
  onChange: (v: View) => void;
}

const TABS: { id: View; label: string; icon: typeof PackagePlus }[] = [
  { id: 'home', label: 'Nhật ký mua', icon: PackagePlus },
  { id: 'analytics', label: 'Phân tích', icon: LayoutDashboard },
];

/** Bottom tab bar on mobile, top nav on desktop */
export function NavBar({ view, onChange }: Props) {
  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex items-center gap-1 border-b border-slate-200 bg-white px-6 py-3">
        <span className="mr-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Cat size={22} className="text-emerald-600" /> KittenFood
        </span>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === id
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex border-t border-slate-200 bg-white md:hidden">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              view === id ? 'text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}

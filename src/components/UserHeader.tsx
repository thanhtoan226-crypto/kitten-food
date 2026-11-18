import { LogOut, Share2, ShieldCheck, Eye } from 'lucide-react';

interface User {
  name: string;
  email: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

interface Props {
  user: User;
  isOwner: boolean;
  onToggleMode: () => void;
  onShare: () => void;
  onLogout: () => void;
}

export function UserHeader({ user, isOwner, onToggleMode, onShare, onLogout }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMode}
          title={isOwner ? 'Owner mode — click to preview read-only' : 'Viewer mode — click to edit'}
          className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            isOwner
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          {isOwner ? <ShieldCheck size={14} /> : <Eye size={14} />}
          {isOwner ? 'Owner' : 'Viewer'}
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={onLogout}
          title="Đăng xuất"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

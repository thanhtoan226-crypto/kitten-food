import { useState } from 'react';
import { usePurchases } from './hooks/usePurchases';
import { NavBar, type View } from './components/NavBar';
import { UserHeader } from './components/UserHeader';
import { ShareModal } from './components/ShareModal';
import { LoginScreen } from './components/LoginScreen';
import { HomeView } from './views/HomeView';
import { AnalyticsView } from './views/AnalyticsView';

const MOCK_USER = {
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@gmail.com',
};

export default function App() {
  const store = usePurchases();
  const [user, setUser] = useState<typeof MOCK_USER | null>(MOCK_USER);
  const [isOwner, setIsOwner] = useState(true);
  const [view, setView] = useState<View>('home');
  const [shareOpen, setShareOpen] = useState(false);

  if (!user) {
    return <LoginScreen onLogin={() => setUser(MOCK_USER)} />;
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <UserHeader
        user={user}
        isOwner={isOwner}
        onToggleMode={() => setIsOwner((o) => !o)}
        onShare={() => setShareOpen(true)}
        onLogout={() => setUser(null)}
      />
      <NavBar view={view} onChange={setView} />

      <main className="mx-auto max-w-6xl px-4 py-4 pb-24 md:pb-8">
        {view === 'home' ? (
          <HomeView store={store} isOwner={isOwner} />
        ) : (
          <AnalyticsView purchases={store.purchases} />
        )}
      </main>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        isOwner={isOwner}
        onToggleMode={() => setIsOwner((o) => !o)}
      />
    </div>
  );
}

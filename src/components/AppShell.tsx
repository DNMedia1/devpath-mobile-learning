import { BookOpen, FolderKanban, Home, PieChart, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Start', icon: Home },
  { to: '/courses', label: 'Kurse', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: PieChart },
  { to: '/projects', label: 'Projekte', icon: FolderKanban },
  { to: '/profile', label: 'Profil', icon: UserRound }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const activeItem = navItems.find((item) => item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to));

  return (
    <div className="min-h-screen bg-ink text-text">
      <div className="app-bg" />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#0b0f14]/88 px-5 py-6 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <NavLink to="/" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#ffd94d] to-[#50a7ff] text-sm font-black text-ink">DP</div>
            <div>
              <p className="text-sm font-black leading-5">DevPath</p>
              <p className="text-xs font-bold text-muted">Mobile Learning</p>
            </div>
          </NavLink>
          <nav className="mt-8 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `desktop-nav-item ${isActive ? 'desktop-nav-item-active' : ''}`}>
                  <Icon size={20} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-auto rounded-3xl border border-white/10 bg-panel/80 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted">Aktueller Bereich</p>
            <p className="mt-2 text-lg font-black">{activeItem?.label ?? 'Lernen'}</p>
            <p className="mt-1 text-sm leading-6 text-muted">Breite Ansicht für Laptop und Desktop, kompakte Navigation für Handy.</p>
          </div>
        </div>
      </aside>
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-4 pb-28 pt-safe-top sm:px-5 md:max-w-[760px] lg:ml-72 lg:max-w-none lg:px-8 lg:pb-10 xl:px-10">
        <div className="flex-1 py-5 lg:w-full lg:max-w-[1200px] lg:py-8">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-white/10 bg-[#0b0f14]/92 px-3 pb-safe-bottom pt-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
                <Icon size={20} strokeWidth={2.2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

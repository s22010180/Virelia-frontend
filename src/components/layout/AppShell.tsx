import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpenCheck, FlaskConical, History, LayoutDashboard, LogOut, Menu, ScrollText, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { AiNoticeBadge } from '@/components/compliance/AiNoticeBadge';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import type { Role } from '@/types/api';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

const NAV: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['lecturer', 'student'] },
  { to: '/app/sessions', label: 'Sessions & Reports', icon: History, roles: ['lecturer'] },
  { to: '/app/research', label: 'Research Data', icon: FlaskConical, roles: ['lecturer'] },
  { to: '/app/transparency', label: 'Transparency', icon: ScrollText, roles: ['lecturer', 'student'] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const items = NAV.filter((n) => user && n.roles.includes(user.role));
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Main">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('size-[18px] transition-colors', isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-brand-50 p-4">
        <BookOpenCheck className="mb-2 size-5 text-violet-600" />
        <p className="text-[13px] font-bold text-slate-800">Decision support only</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Indicators never replace the examiner's judgement and are never used to grade automatically.
        </p>
      </div>
    </div>
  );
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawer(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/80 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div className={cn('no-print fixed inset-0 z-50 lg:hidden', drawer ? 'visible' : 'invisible')} aria-hidden={!drawer}>
        <div
          className={cn('absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300', drawer ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawer(false)}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 w-72 bg-white shadow-pop transition-transform duration-300 ease-out',
            drawer ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <button
            type="button"
            className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
          <SidebarContent onNavigate={() => setDrawer(false)} />
        </aside>
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <AiNoticeBadge />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-900">{user?.full_name}</p>
              <div className="mt-0.5 flex justify-end">
                <Badge tone={user?.role === 'lecturer' ? 'brand' : 'green'} className="capitalize">
                  {user?.role === 'lecturer' ? 'Examiner' : 'Student'}
                </Badge>
              </div>
            </div>
            <Avatar name={user?.full_name} />
            <button
              type="button"
              onClick={logout}
              className="rounded-xl p-2.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
          <Outlet />
        </main>

        <footer className="no-print border-t border-slate-200/70 px-4 py-4 text-center text-xs text-slate-400 lg:px-8">
          Decision-support tool · The examiner always decides ·{' '}
          <NavLink to="/app/transparency" className="font-semibold text-slate-500 underline-offset-2 hover:underline">
            AI transparency &amp; your rights
          </NavLink>
        </footer>
      </div>
    </div>
  );
}

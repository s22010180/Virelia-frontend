import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl lg:px-8">
        <Link to="/"><Logo /></Link>
        <Link to={user ? '/app/dashboard' : '/login'}>
          <Button variant="secondary" size="sm">{user ? 'Open app' : 'Sign in'}</Button>
        </Link>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 lg:px-8">{children}</main>
    </div>
  );
}

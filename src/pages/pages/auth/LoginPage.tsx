import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/hooks/useToast';

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; registered?: boolean } | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}.`);
      navigate(state?.from && state.from.startsWith('/app') ? state.from : '/app/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Access your viva sessions and reports.">
      {state?.registered && (
        <Alert tone="success" className="mb-5" title="Account created">You can sign in now.</Alert>
      )}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your university email"
          leftIcon={<Mail className="size-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Enter your password"
          leftIcon={<KeyRound className="size-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        {error && <Alert tone="danger">{error}</Alert>}
        <Button type="submit" size="lg" block loading={busy}>Sign In</Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Sign Up</Link>
      </p>
    </AuthLayout>
  );
}

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, KeyRound, Mail, Presentation, UserRound } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cn } from '@/lib/cn';
import type { Role } from '@/types/api';

function strength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return { score, label: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score] };
}

const BAR = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];

export default function RegisterPage() {
  useDocumentTitle('Create account');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invite, setInvite] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pw = useMemo(() => strength(password), [password]);
  const validPassword = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) return setError('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (!validPassword) return setError('Password needs at least 8 characters, including a letter and a number.');
    if (!accepted) return setError('Please confirm that you have read the AI transparency notice.');
    setBusy(true);
    setError(null);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        invite_code: role === 'lecturer' && invite.trim() ? invite.trim() : undefined,
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Choose how you will take part in vivas.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
          {([
            { value: 'student', label: 'Student', hint: 'Take a viva', icon: GraduationCap },
            { value: 'lecturer', label: 'Examiner', hint: 'Conduct vivas', icon: Presentation },
          ] as const).map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={role === o.value}
              onClick={() => setRole(o.value)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all',
                role === o.value ? 'border-brand-500 bg-brand-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300',
              )}
            >
              <o.icon className={cn('size-6', role === o.value ? 'text-brand-600' : 'text-slate-400')} />
              <span className="text-sm font-bold text-slate-900">{o.label}</span>
              <span className="text-xs text-slate-500">{o.hint}</span>
            </button>
          ))}
        </div>

        <Input label="Full name" autoComplete="name" leftIcon={<UserRound className="size-4" />} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
        <Input label="University email" type="email" autoComplete="email" leftIcon={<Mail className="size-4" />} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your university email" />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            leftIcon={<KeyRound className="size-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter at least 8 characters"
            hint="Use a letter and a number at minimum."
          />
          {password && (
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('h-1.5 flex-1 rounded-full transition-colors', pw.score >= i ? BAR[pw.score] : 'bg-slate-200')} />
                ))}
              </div>
              <span className="w-16 text-right text-xs font-semibold text-slate-500">{pw.label}</span>
            </div>
          )}
        </div>

        {role === 'lecturer' && (
          <Input
            label="Examiner invite code"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            placeholder="Provided by your department"
            hint="Only required if your institution has enabled invite codes."
            className="animate-fade-in"
          />
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:bg-slate-50">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          <span className="text-[13px] leading-5 text-slate-600">
            I have read the{' '}
            <Link to="/transparency" target="_blank" className="font-semibold text-brand-600 underline underline-offset-2">AI transparency notice</Link>
            . I understand this tool supports, and never replaces, the examiner’s decision.
          </span>
        </label>

        {error && <Alert tone="danger">{error}</Alert>}
        <Button type="submit" size="lg" block loading={busy}>Sign Up</Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign In</Link>
      </p>
    </AuthLayout>
  );
}

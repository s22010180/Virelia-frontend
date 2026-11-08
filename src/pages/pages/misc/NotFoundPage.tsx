import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md animate-slide-up text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-3xl bg-brand-50 text-brand-600"><Compass className="size-8" /></span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist or has moved.</p>
        <Link to="/app/dashboard" className="mt-7 inline-block"><Button size="lg">Go to dashboard</Button></Link>
      </div>
    </div>
  );
}

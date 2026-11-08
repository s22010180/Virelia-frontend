import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import LecturerDashboard from '@/pages/dashboard/LecturerDashboard';
import StudentDashboard from '@/pages/dashboard/StudentDashboard';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  return user?.role === 'lecturer' ? <LecturerDashboard /> : <StudentDashboard />;
}

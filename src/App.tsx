import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PublicOnly, RequireAuth, RequireRole } from '@/components/layout/guards';
import { PageLoader } from '@/components/ui/Spinner';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const SessionsPage = lazy(() => import('@/pages/sessions/SessionsPage'));
const ReportPage = lazy(() => import('@/pages/sessions/ReportPage'));
const LobbyPage = lazy(() => import('@/pages/room/LobbyPage'));
const RoomPage = lazy(() => import('@/pages/room/RoomPage'));
const ResearchPage = lazy(() => import('@/pages/research/ResearchPage'));
const TransparencyPage = lazy(() => import('@/pages/compliance/TransparencyPage'));
const NotFoundPage = lazy(() => import('@/pages/misc/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/transparency" element={<PublicLayout><TransparencyPage /></PublicLayout>} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/lobby/:sessionId" element={<LobbyPage />} />
            <Route path="/app/transparency" element={<TransparencyPage />} />
            <Route element={<RequireRole role="lecturer" />}>
              <Route path="/app/sessions" element={<SessionsPage />} />
              <Route path="/app/sessions/:sessionId/report" element={<ReportPage />} />
              <Route path="/app/research" element={<ResearchPage />} />
            </Route>
          </Route>
          {/* Full-screen room: no sidebar */}
          <Route path="/app/room/:roomId" element={<RoomPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

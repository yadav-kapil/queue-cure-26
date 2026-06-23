import { Outlet, Navigate } from 'react-router'
import NavigationbarDoc from '../components/app/doctor/NavigationbarDoc';
import NavigationbarRec from '../components/app/rec/NavigationbarRec';
import { useAuth } from '../context/auth/AuthContext';
import { SessionContextProvider } from '../context/session/SessionContext';

const ProtectedLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <SessionContextProvider>
      <div className="min-h-screen bg-[#f7f9fc] text-[#111827]">
        {user?.role === 'doctor' ? <NavigationbarDoc /> : <NavigationbarRec />}
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-24 pt-24 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </SessionContextProvider>
  )
}

export default ProtectedLayout

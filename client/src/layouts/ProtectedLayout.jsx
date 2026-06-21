import { Outlet, Navigate } from 'react-router'
import Navigationbar from '../components/app/Navigationbar';
import { useAuth } from '../context/auth/AuthContext';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#111827]">
      <Navigationbar />
      <main className="mx-auto w-full max-w-[1480px] px-4 pb-32 pt-24 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedLayout

import { Outlet } from "react-router";
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#080b13]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;

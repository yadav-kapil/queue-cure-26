import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "../../../components/common/Footer";

const LegalLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pt-24 pb-16 bg-[#f7f8fb]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LegalLayout;

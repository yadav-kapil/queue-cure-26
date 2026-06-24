import React from "react";
import { Outlet } from "react-router";
import Footer from "../../../components/common/Footer";

const LegalLayout = () => {
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

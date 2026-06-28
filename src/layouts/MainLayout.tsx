import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary">
      <Navbar />

      <main className="flex-grow pt-[88px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
export default MainLayout;

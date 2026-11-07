import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  // All admin pages share one animation key, so the admin side menu does not blink
  const sectionKey = location.pathname.startsWith("/admin") ? "admin" : location.pathname;

  // Every new page starts from the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="container page-enter" key={sectionKey}>
        <Outlet />
      </main>
    </>
  );
}
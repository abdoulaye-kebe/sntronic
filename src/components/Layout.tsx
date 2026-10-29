import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer.tsx";
import { ChatWidget } from "./ChatWidget.tsx";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main id="contenu">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </>
  );
}

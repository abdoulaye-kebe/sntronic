import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { AdminEditor } from "./pages/AdminEditor.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { ServicesPage } from "./pages/ServicesPage.tsx";
import { CartPage } from "./pages/CartPage.tsx";
import { CatalogPage } from "./pages/CatalogPage.tsx";
import { CheckoutPage, ConfirmationPage } from "./pages/CheckoutPage.tsx";
import { ContactPage } from "./pages/ContactPage.tsx";
import { GuidePage } from "./pages/GuidePage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ProductPage } from "./pages/ProductPage.tsx";
import { ShippingPage } from "./pages/ShippingPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogue" element={<CatalogPage />} />
        <Route path="catalogue/:category" element={<CatalogPage />} />
        <Route path="produit/:slug" element={<ProductPage />} />
        <Route path="panier" element={<CartPage />} />
        <Route path="commande" element={<CheckoutPage />} />
        <Route path="commande/confirmation" element={<ConfirmationPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="a-propos" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="livraison" element={<ShippingPage />} />
        <Route path="mentions" element={<LegalPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/nouveau" element={<AdminEditor />} />
        <Route path="admin/:slug" element={<AdminEditor />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

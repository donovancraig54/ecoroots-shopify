import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import Product from './pages/Product.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CartDrawer />
      <AnnouncementBar />
      <Header />
      <div className="page-body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:handle" element={<Collection />} />
          <Route path="/products/:handle" element={<Product />} />
          <Route path="/collections/:collection/products/:handle" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

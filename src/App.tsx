import { useEffect, useState } from "react";
import PPM_PRODUCT_RISER_1 from "./images/PPM_Product_Riser_1.webp";
import productsData from "./data/products.json";
import settingsData from "./data/settings.json";
import { Navigation } from "./components/Navigation";
import { ProductGallery } from "./components/ProductGallery";
import { ProductDetail } from "./components/ProductDetail";
import { AboutPage } from "./components/AboutPage";
import { AdminPage } from "./components/AdminPage";
import { Toaster } from "./components/ui/sonner";

// Mock product data (upcycled plastic products)
// Use JSON files (written by admin workflow) as initial data, fallback to embedded list
const embeddedProducts = [
  {
    id: 1,
    name: "Upcycled Plantenpot",
    category: "Home & Garden",
    price: "€24,95",
    image: PPM_PRODUCT_RISER_1,
    description:
      "Handgemaakte plantenpot gemaakt van gerecycled en geupcycled plastic. Stevig, weerbestendig en perfect voor binnen en buiten.",
    benefits: [
      "Gemaakt van gerecycled plastic",
      "UV-bestendig en kleurvast",
      "Uniek handgemaakt design",
      "Makkelijk schoon te maken",
    ],
    ingredients: ["Geupcycled polypropyleen", "Kleurpigmenten (vegan)"],
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "admin">(
    "home"
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [products, setProducts] = useState(
    (productsData as any) && (productsData as any).length
      ? (productsData as any)
      : embeddedProducts
  );

  const [settings, setSettings] = useState(
    (settingsData as any) || {
      siteName: "ReVita",
      aboutText: `ReVita ontwerpt en produceert stijlvolle en functionele producten gemaakt van geupcycled plastic. We hergebruiken materialen die anders afval zouden worden en transformeren ze in duurzame items voor thuis, kantoor en onderweg.`,
      primaryColor: "#10b981",
    }
  );

  // LocalStorage persistence: load any saved overrides, and persist on change
  useEffect(() => {
    try {
      const rawProducts = localStorage.getItem("revita_products");
      if (rawProducts) {
        setProducts(JSON.parse(rawProducts));
      }
    } catch (e) {
      // ignore parse errors
    }
    try {
      const rawSettings = localStorage.getItem("revita_settings");
      if (rawSettings) {
        setSettings(JSON.parse(rawSettings));
      }
    } catch (e) {
      // ignore
    }
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("revita_products", JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("revita_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const handleNavigate = (page: "home" | "about" | "admin") => {
    setCurrentPage(page);
    setSelectedProductId(null);
  };

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId);
  };

  const handleBackToGallery = () => {
    setSelectedProductId(null);
  };

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId) || null
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        siteName={settings.siteName}
      />

      {currentPage === "home" && !selectedProduct && (
        <ProductGallery
          products={products}
          onProductClick={handleProductClick}
        />
      )}

      {currentPage === "home" && selectedProduct && (
        <ProductDetail product={selectedProduct} onBack={handleBackToGallery} />
      )}

      {currentPage === "about" && <AboutPage aboutText={settings.aboutText} />}

      {currentPage === "admin" && (
        <AdminPage
          products={products}
          setProducts={setProducts}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      <Toaster />
    </div>
  );
}

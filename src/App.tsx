import { useState } from "react";
import PPM_PRODUCT_RISER_1 from "./images/PPM_Product_Riser_1.webp";
import { Navigation } from "./components/Navigation";
import { ProductGallery } from "./components/ProductGallery";
import { ProductDetail } from "./components/ProductDetail";
import { AboutPage } from "./components/AboutPage";
import { Toaster } from "./components/ui/sonner";

// Mock product data (upcycled plastic products)
const products = [
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
  {
    id: 2,
    name: "Herbruikbare Opbergbox",
    category: "Organisatie",
    price: "€19,95",
    image:
      "https://images.unsplash.com/photo-1598302789254-8d9b1d6b3b20?auto=format&fit=crop&w=1080&q=80",
    description:
      "Stevige opbergbox gemaakt van gerecyclede kunststof. Ideaal voor kasten, garages en kleine ruimtes.",
    benefits: [
      "Stapbaar ontwerp",
      "Makkelijk te reinigen",
      "100% gerecycled materiaal",
    ],
    ingredients: ["Geupcycled HDPE", "Rubberen anti-slip basis"],
  },
  {
    id: 3,
    name: "Duurzame Drinkfles",
    category: "Outdoor",
    price: "€14,95",
    image:
      "https://images.unsplash.com/photo-1505575967452-1c7f4d6b8b05?auto=format&fit=crop&w=1080&q=80",
    description:
      "Lightweight drinkfles gemaakt van gerecycled PET, BPA-vrij en perfect voor onderweg.",
    benefits: ["BPA-vrij", "Gerecycled materiaal", "Lichtgewicht en lekvrij"],
    ingredients: ["Gerecycled PET", "Silikonendop"],
  },
  {
    id: 4,
    name: "Bureaulade Organizer",
    category: "Kantoor",
    price: "€9,95",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1080&q=80",
    description:
      "Compacte organizer voor op je bureau, gemaakt van geupcycled plastic met meerdere compartimenten.",
    benefits: ["Compact", "Veel vakken", "Gerecycled materiaal"],
    ingredients: ["Geupcycled kunststof"],
  },
  {
    id: 5,
    name: "Eco Winkelwagen-tas",
    category: "Lifestyle",
    price: "€12,95",
    image:
      "https://images.unsplash.com/photo-1520975925700-1f9d3dd85f47?auto=format&fit=crop&w=1080&q=80",
    description:
      "Opvouwbare tas gemaakt van gerecycled plastic; sterk genoeg voor boodschappen en makkelijk mee te nemen.",
    benefits: [
      "Opvouwbaar",
      "Sterk draagvermogen",
      "Gemaakt van gerecycled materiaal",
    ],
    ingredients: ["Geupcycled polyester"],
  },
  {
    id: 6,
    name: "Matrix Schoenplaatjes",
    category: "Accessoires",
    price: "€7,95",
    image:
      "https://images.unsplash.com/photo-1519741494199-6ec7ac3b5e39?auto=format&fit=crop&w=1080&q=80",
    description:
      "Kleine schoenplaatjes en hakbeschermers gemaakt van stevig gerecycled plastic.",
    benefits: [
      "Beschermt schoenen",
      "Lichtgewicht",
      "Gemaakt van gerecycled materiaal",
    ],
    ingredients: ["Geupcycled kunststof"],
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "about">("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleNavigate = (page: "home" | "about") => {
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
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === "home" && !selectedProduct && (
        <ProductGallery
          products={products}
          onProductClick={handleProductClick}
        />
      )}

      {currentPage === "home" && selectedProduct && (
        <ProductDetail product={selectedProduct} onBack={handleBackToGallery} />
      )}

      {currentPage === "about" && <AboutPage />}

      <Toaster />
    </div>
  );
}

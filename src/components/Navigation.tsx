import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  siteName?: string;
}

export function Navigation({
  currentPage,
  onNavigate,
  siteName = "ReVita",
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white">
                {siteName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-emerald-900">{siteName}</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate("home")}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentPage === "home"
                  ? "text-emerald-600"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("about")}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentPage === "about"
                  ? "text-emerald-600"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Over
            </button>
            <button
              onClick={() => onNavigate("admin")}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentPage === "admin"
                  ? "text-emerald-600"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onNavigate("home");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                currentPage === "home"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate("about");
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                currentPage === "about"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Over Ons
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

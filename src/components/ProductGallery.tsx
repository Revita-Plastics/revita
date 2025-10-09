import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
}

interface ProductGalleryProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

export function ProductGallery({ products, onProductClick }: ProductGalleryProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-emerald-900 mb-4">Onze Producten</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ontdek onze collectie van hoogwaardige natuurlijke supplementen en welzijnsproducten
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product.id)}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden text-left"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <span className="text-emerald-600 text-sm">{product.category}</span>
              <h3 className="text-gray-900 mt-1">{product.name}</h3>
              <p className="text-gray-700 mt-2">{product.price}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

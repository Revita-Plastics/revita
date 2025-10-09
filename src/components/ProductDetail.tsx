import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
  description: string;
  benefits: string[];
  ingredients: string[];
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar producten
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <span className="text-emerald-600">{product.category}</span>
          <h1 className="text-emerald-900 mt-2">{product.name}</h1>
          <p className="text-gray-900 mt-4">{product.price}</p>

          <p className="text-gray-700 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <h3 className="text-gray-900 mb-3">Voordelen</h3>
            <ul className="space-y-2">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-gray-900 mb-3">Ingrediënten</h3>
            <p className="text-gray-700">{product.ingredients.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

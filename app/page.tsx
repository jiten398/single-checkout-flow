'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define types for variants
type ColorVariant = 'Black' | 'White' | 'Blue' | 'Red' | 'Green' | 'Gray';
type SizeVariant = 'S' | 'M' | 'L' | 'XL';

interface SelectedVariant {
  color: ColorVariant;
  size: SizeVariant;
}

export default function LandingPage() {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<SelectedVariant>({ color: 'Black', size: 'M' });
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const product = {
    id: '1',
    name: 'Premium T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear.',
    price: 29.99,
    image: 'https://image.hm.com/assets/hm/05/66/05664a801dd930fcfcee8bc419221598e426794b.jpg',
    variants: {
      color: ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'] as ColorVariant[],
      size: ['S', 'M', 'L', 'XL'] as SizeVariant[]
    }
  };

  // Color mapping for variants with proper typing
  const colorMap: Record<ColorVariant, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Blue': '#3B82F6',
    'Red': '#EF4444',
    'Green': '#10B981',
    'Gray': '#6B7280'
  };

  const handleBuyNow = () => {
    // Store selection in sessionStorage
    sessionStorage.setItem('selectedProduct', JSON.stringify({
      ...product,
      selectedVariant,
      quantity
    }));
    router.push('/checkout');
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
              <p className="text-3xl font-bold text-gray-900">${product.price}</p>
              
              <div className="space-y-6">
                {/* Color Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color: <span className="font-normal text-gray-500">{selectedVariant.color}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.color.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({...selectedVariant, color})}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedVariant.color === color 
                            ? 'border-gray-900 shadow-lg scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: colorMap[color] }}
                        title={color}
                      >
                        {selectedVariant.color === color && (
                          <div className="absolute inset-0 rounded-full flex items-center justify-center">
                            <svg
                              className={`w-6 h-6 ${color === 'White' ? 'text-gray-800' : 'text-white'}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Size Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Size: <span className="font-normal text-gray-500">{selectedVariant.size}</span>
                  </label>
                  <div className="flex gap-3">
                    {product.variants.size.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({...selectedVariant, size})}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                          selectedVariant.size === size
                            ? 'bg-gray-900 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={decreaseQuantity}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-l-lg"
                        disabled={quantity === 1}
                      >
                        <svg
                          className={`w-4 h-4 ${quantity === 1 ? 'text-gray-300' : 'text-gray-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="px-6 py-2 font-medium text-gray-900 min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-r-lg"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      ${(product.price * quantity).toFixed(2)} total
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
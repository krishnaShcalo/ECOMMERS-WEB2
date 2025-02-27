import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { useProducts } from '../../hooks/useProducts';

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const addToCart = useStore((state) => state.addToCart);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = products.find(p => p.id === productId);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      window.alert('Added to cart successfully!');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            <div className="bg-gray-200 h-96 rounded-lg" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="lg:w-1/3 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
          <li className="text-gray-500">/</li>
          <li><a href="/products" className="text-blue-600 hover:underline">Products</a></li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-500">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Images */}
        <div className="lg:w-2/3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 border-2 rounded-lg overflow-hidden
                    ${selectedImage === index ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="lg:w-1/3">
          {/* Brand and Title */}
          <div className="mb-4">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              {product.category}
            </a>
            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                (1,244 Reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Financing Option */}
            <div className="mt-2 text-sm">
              <span className="font-medium">${(product.price / 12).toFixed(2)}/mo</span>
              <span className="text-gray-600"> suggested payments with </span>
              <span className="font-medium">12-Month Financing</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <h2 className="font-bold mb-4">Key Features</h2>
            <ul className="space-y-3 text-sm">
              {product.description.split('. ').map((feature, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-blue-600">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add to Cart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 
                disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Store Pickup */}
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <span className="font-bold">Pickup: </span>
                  Ready in 1 hour at your store
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M truck" />
                </svg>
                <span>
                  <span className="font-bold">Free shipping: </span>
                  Get it by tomorrow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
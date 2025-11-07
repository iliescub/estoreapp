  import { useState } from 'react';
  import { useCart } from '../context/CartContext';
  import QuantityModal from './QuantityModal';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
 const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
  
    const openModal = () => {
      setQuantity(1);
      setIsModalOpen(true);
    };
  
    const confirmAdd = () => {
      addItem(product, quantity);
      setIsModalOpen(false);
    };

  return (
  <>
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
      </div>
    </div>
    {isModalOpen && (
          <QuantityModal
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            onConfirm={confirmAdd}
            onClose={() => setIsModalOpen(false)}
          />
    )}
  </>  
  );
}

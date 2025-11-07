import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b">
            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={clearCart}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Cart
          </button>
          <div className="text-right">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
            <button className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

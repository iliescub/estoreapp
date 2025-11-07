 import { useEffect } from 'react';

  export default function QuantityModal({ product, quantity, setQuantity, onConfirm, onClose }) {
    // close on Escape for ergonomics
    useEffect(() => {
      const handleKey = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
    const increment = () =>
      setQuantity((prev) => Math.min(product.stock ?? 99, prev + 1));

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h4 className="text-lg font-semibold text-slate-900">{product.name}</h4>
          <p className="mt-1 text-sm text-slate-500">Choose how many you’d like to add.</p>

          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              onClick={decrement}
              className="h-10 w-10 rounded-full border border-slate-200 text-lg font-semibold text-slate-700"
            >
              –
            </button>
            <span className="text-2xl font-bold text-slate-900">{quantity}</span>
            <button
              onClick={increment}
              className="h-10 w-10 rounded-full border border-slate-200 text-lg font-semibold text-slate-700"
            >
              +
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
            >
              Add {quantity}
            </button>
          </div>
        </div>
      </div>
    );
  }
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () =>
      selectedCategory
        ? productsAPI.getByCategory(selectedCategory)
        : productsAPI.getAll(),

  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),

  });

  const filteredProducts = products?.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (productsLoading) return <div className="text-center py-8">Loading...</div>;

  return (
 <section className="space-y-8 pt-10">
      <header className="rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">Featured products</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-900">Find gear you’ll love</h1>
            <p className="mt-2 text-slate-500">
              Browse by category, search by name, and add items to your cart instantly.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search headphones, laptops..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700
  placeholder:text-slate-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-
  blue-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
              {/* optional magnifier icon */}
            </span>
          </div>
        </div>
      </header>


       <div className="flex flex-wrap items-center gap-3">
    <button
      onClick={() => setSelectedCategory(null)}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        !selectedCategory
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
      }`}
    >
      All categories
    </button>

    {categories?.map((cat) => (
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat.id)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          selectedCategory === cat.id
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
        ))}
    </div>
    </section>
  );
}

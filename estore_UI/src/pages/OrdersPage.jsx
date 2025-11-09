  import { useMemo } from 'react';
  import { useQuery } from '@tanstack/react-query';
  import { Link } from 'react-router-dom';
  import { ordersAPI } from '../services/api';
  import { useAuth } from '../context/AuthContext';

  export default function OrdersPage() {
    const { user } = useAuth();

    const { data: orders, isLoading, isError, error } = useQuery({
      queryKey: ['orders', user?.id],
      queryFn: () => ordersAPI.getMine(user.id),
      enabled: Boolean(user?.id),
    });

    const content = useMemo(() => {
      if (!user) {
        return (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-lg font-semibold">Please sign in to view your orders.</p>
            <Link to="/login" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">
              Go to login
            </Link>
          </div>
        );
      }

      if (isLoading) return <p className="py-8 text-center">Loading your orders…</p>;
      if (isError) return <p className="py-8 text-center text-red-600">{error?.message ?? 'Unable to load orders.'}</p>;
      if (!orders?.length) return <p className="py-8 text-center">You have not placed any orders yet.</p>;

      return (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl bg-white p-6 shadow">
              <header className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-500">Order #{order.id}</p>
                  <p className="text-lg font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium uppercase tracking-wide text-slate-700">
                  {order.status}
                </span>
              </header>

              <ul className="mt-4 divide-y divide-slate-200 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2">
                    <span>Product #{item.productId}</span>
                    <span className="text-slate-500">
                      Qty {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <footer className="mt-4 text-right text-base font-semibold text-blue-600">
                Total: ${order.total.toFixed(2)}
              </footer>
            </article>
          ))}
        </div>
      );
    }, [user, orders, isLoading, isError, error]);

    return (
      <section className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-600">Track the status of everything you have purchased.</p>
        <div className="mt-8">{content}</div>
      </section>
    );
  }
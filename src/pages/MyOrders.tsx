// frontend/src/pages/MyOrders.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { axiosInstanse } from '../config/Axios.Instanse';

type Order = {
  _id: string;
  products: { name: string; price: number; quantity: number }[];
  amount: number;
  status: string;
  createdAt: string;
};

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      try {
        const res = await axiosInstanse.get(`/api/orders/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return <div className="p-8 text-center">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl mb-4">No orders yet</h2>
        <a href="/products" className="text-blue-600 hover:underline">
          Start shopping!
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Order ID: {order._id.slice(-6)}</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="mb-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold">
              <span className={order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                Status: {order.status}
              </span>
              <span>Total: ₹{order.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
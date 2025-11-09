// frontend/src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

type Order = {
  _id: string;
  products: { name: string; price: number; image: string; quantity: number }[];
  amount: number;
  createdAt: string;
};

export default function Home() {
  const { token, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  const paymentSuccess = searchParams.get('payment') === 'success';

  useEffect(() => {
    if (paymentSuccess && user?.id) {
      // Fetch latest order
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`/api/orders/${user.id}`);
          if (res.data.length > 0) {
            setRecentOrder(res.data[0]);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchOrder();
    }
  }, [paymentSuccess, user?.id]);
console.log(token);
  if (paymentSuccess && recentOrder) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Success! </strong>
          Your payment was completed successfully.
        </div>

        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="border rounded p-4">
          <p className="mb-2">Order Date: {new Date(recentOrder.createdAt).toLocaleString()}</p>
          <p className="mb-4">Total Amount: ₹{recentOrder.amount}</p>
          <h3 className="font-semibold mb-2">Products:</h3>
          <ul className="space-y-2">
            {recentOrder.products.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate('/products')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Ecom Store</h1>
      {token ? (
        <>
          <p className="mb-4">Hello, {user?.name}!</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Browse Products
            </button>
            {cart.length > 0 && (
              <button
                onClick={() => navigate('/cart')}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                View Cart ({cart.length})
              </button>
            )}
            <button
              onClick={() => navigate('/orders')}
              className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-100"
            >
              My Orders
            </button>
          </div>
        </>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
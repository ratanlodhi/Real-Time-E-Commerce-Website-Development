// frontend/src/pages/Checkout.tsx
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { axiosInstanse } from '../config/Axios.Instanse';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const res = await axiosInstanse.post('/api/payment/create-order', {
        amount: total,
        userId: user.id,
        products: cart.map((item) => ({ productId: item.productId })),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount, // in paise
        currency: res.data.currency,
        name: 'Ecom Store',
        description: 'Order Payment',
        order_id: res.data.orderId,
        handler: async function (response: any) {
          try {
            await axiosInstanse.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            clearCart();
            navigate('/?payment=success');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="border rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.productId} className="flex justify-between py-2 border-b">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2 text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 rounded text-white font-semibold ${
          loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now with Razorpay'}
      </button>
    </div>
  );
}

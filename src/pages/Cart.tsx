// frontend/src/pages/Cart.tsx
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center border p-4 rounded">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-green-600">₹{item.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 flex justify-between items-center">
        <h2 className="text-xl">Total: ₹{total.toFixed(2)}</h2>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
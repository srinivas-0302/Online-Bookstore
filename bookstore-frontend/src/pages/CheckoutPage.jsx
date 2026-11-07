import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { placeOrderRequest } from "../api/orderApi";
import FormField from "../components/FormField";
import useCart from "../hooks/useCart";
import { parseApiError } from "../utils/errorHelper";
import { formatPrice } from "../utils/format";

export default function CheckoutPage() {
  const { cart, cartLoading, refreshCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [error, setError] = useState({ message: "", fieldErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  if (cartLoading) return <p>Loading...</p>;

  // Nothing to buy? Go back to the cart page
  if (cart.items.length === 0) return <Navigate to="/cart" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError({ message: "", fieldErrors: {} });

    try {
      // We send ONLY the address. The server reads the cart and the real prices.
      const response = await placeOrderRequest({ shippingAddress: address.trim() });
      const order = response.data;

      navigate("/order-success", {
        replace: true,
        state: {
          orderId: order.orderId,
          totalItems: order.totalItems,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
        },
      });

      refreshCart().catch(() => {});      // the server has emptied the cart, so reload it
    } catch (err) {
      setError(parseApiError(err));
      refreshCart().catch(() => {});      // stock may have changed, so show the latest cart
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>

      <div className="cart-layout">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h2>Shipping address</h2>

          {error.message && (
            <div className="alert alert-error">
              <p>{error.message}</p>
              <Link to="/cart">Go back to your cart</Link>
            </div>
          )}

          <FormField
            as="textarea"
            rows={4}
            label="Full address with pincode"
            name="shippingAddress"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            error={error.fieldErrors.shippingAddress}
            placeholder="House number, street, area, city, state, pincode"
            autoComplete="street-address"
          />

          <h2>Payment</h2>
          <p className="muted">
            Cash on delivery. You pay when the books reach you. (Payment is simulated in this project.)
          </p>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Placing order..." : `Place order • ${formatPrice(cart.totalAmount)}`}
          </button>
        </form>

        <aside className="card cart-summary">
          <h2>Your books</h2>
          <ul className="summary-list">
            {cart.items.map((item) => (
              <li key={item.cartItemId}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="details">
            <dt>Total</dt>
            <dd className="price">{formatPrice(cart.totalAmount)}</dd>
          </dl>
          <Link to="/cart">Edit cart</Link>
        </aside>
      </div>
    </div>
  );
}
import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/format";

export default function OrderSuccessPage() {
  const { state } = useLocation();

  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <div className="card auth-card success-card">
      <div className="success-icon">✅</div>
      <h1>Order placed!</h1>
      <p>
        Thank you for shopping with us. Your order number is <strong>#{state.orderId}</strong>.
      </p>

      <dl className="details">
        <dt>Books</dt>
        <dd>{state.totalItems}</dd>
        <dt>Total</dt>
        <dd>{formatPrice(state.totalAmount)}</dd>
        <dt>Deliver to</dt>
        <dd>{state.shippingAddress}</dd>
        <dt>Payment</dt>
        <dd>Cash on delivery</dd>
      </dl>

      <Link to={`/orders/${state.orderId}`} className="btn btn-primary btn-block">
        View order details
      </Link>
      <Link to="/orders" className="btn btn-outline btn-block">
        My orders
      </Link>
      <Link to="/" className="btn btn-outline btn-block">
        Continue shopping
      </Link>
    </div>
  );
}
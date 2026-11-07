import { Link, useLocation, useParams } from "react-router-dom";
import { getMyOrderById } from "../api/orderApi";
import BookCover from "../components/BookCover";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import StatusBadge from "../components/StatusBadge";
import useFetch from "../hooks/useFetch";
import { formatDateTime, formatPrice } from "../utils/format";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const backTo = location.state?.from || "/orders";

  const { data: order, loading, error } = useFetch(() => getMyOrderById(orderId), [orderId]);

  if (loading) return <p>Loading order...</p>;

  if (error) {
    return (
      <div>
        <p className="alert alert-error">{error}</p>
        <Link to="/orders">← Back to my orders</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to={backTo}>← Back to my orders</Link>

      <div className="card order-header">
        <div>
          <h1>Order #{order.orderId}</h1>
          <p className="muted">Placed on {formatDateTime(order.orderDate)}</p>
        </div>
        <div className="order-badges">
          <StatusBadge status={order.orderStatus} />
          <span className="muted small">
            Payment: <StatusBadge status={order.paymentStatus} />
          </span>
        </div>
      </div>

      <div className="card">
        <h2>Order progress</h2>
        <OrderStatusTimeline status={order.orderStatus} />
      </div>

      <div className="card">
        <h2>Books in this order</h2>
        <div className="table-wrap">
          <table className="items-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Price paid</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.orderItemId}>
                  <td>
                    <div className="item-book">
                      <BookCover imageUrl={item.imageUrl} title={item.title} />
                      <div>
                        <Link to={`/books/${item.bookId}`}>{item.title}</Link>
                        <p className="muted small">{item.author}</p>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(item.priceAtPurchase)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="muted small">
          The prices shown here are the prices at the time you placed the order. They do not change
          if the store changes its prices later.
        </p>

        <dl className="details order-total">
          <dt>Total books</dt>
          <dd>{order.totalItems}</dd>
          <dt>Order total</dt>
          <dd className="price">{formatPrice(order.totalAmount)}</dd>
        </dl>
      </div>

      <div className="card">
        <h2>Delivery</h2>
        <dl className="details">
          <dt>Deliver to</dt>
          <dd className="book-description">{order.shippingAddress}</dd>
          <dt>Payment method</dt>
          <dd>Cash on delivery</dd>
        </dl>
      </div>
    </div>
  );
}
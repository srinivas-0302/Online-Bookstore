import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAdminOrderById, updateOrderStatus } from "../api/adminApi";
import ConfirmDialog from "../components/ConfirmDialog";
import OrderItemsTable from "../components/OrderItemsTable";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import StatusBadge from "../components/StatusBadge";
import useFetch from "../hooks/useFetch";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import { formatDateTime, formatPrice } from "../utils/format";
import {
  NEXT_STATUSES,
  STATUS_ACTION_LABELS,
  STATUS_CONFIRM_MESSAGES,
  statusLabel,
} from "../utils/orderStatus";

function AdminOrderDetailsView({ orderId }) {
  const { showToast } = useToast();
  const location = useLocation();
  const backTo = location.state?.from || "/admin/orders";

  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingStatus, setPendingStatus] = useState(null);   // status waiting for confirmation
  const [updating, setUpdating] = useState(false);

  const { data: order, error } = useFetch(
    () => getAdminOrderById(orderId),
    [orderId, refreshKey]
  );

  const handleConfirm = async () => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, pendingStatus);
      showToast(`Order #${orderId} is now ${statusLabel(pendingStatus)}`);
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setUpdating(false);
      setPendingStatus(null);
      setRefreshKey((key) => key + 1);     // always reload, so the screen shows the real state
    }
  };

  if (error) {
    return (
      <div>
        <p className="alert alert-error">{error}</p>
        <Link to="/admin/orders">← Back to orders</Link>
      </div>
    );
  }

  if (!order) return <p>Loading order...</p>;

  const nextStatuses = NEXT_STATUSES[order.orderStatus] || [];

  return (
    <div>
      <Link to={backTo}>← Back to orders</Link>

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
        <h2>Update status</h2>
        {nextStatuses.length === 0 ? (
          <p className="muted">This order is final. No more changes are possible.</p>
        ) : (
          <div className="status-actions">
            {nextStatuses.map((nextStatus) => (
              <button
                key={nextStatus}
                type="button"
                className={nextStatus === "CANCELLED" ? "btn btn-danger" : "btn btn-primary"}
                onClick={() => setPendingStatus(nextStatus)}
              >
                {STATUS_ACTION_LABELS[nextStatus]}
              </button>
            ))}
          </div>
        )}
        <OrderStatusTimeline status={order.orderStatus} />
      </div>

      <div className="card">
        <h2>Customer</h2>
        <dl className="details">
          <dt>Name</dt>
          <dd>{order.customerName}</dd>
          <dt>Email</dt>
          <dd>{order.customerEmail}</dd>
          <dt>Customer id</dt>
          <dd>
            {order.customerId} •{" "}
            <Link to={`/admin/orders?customerId=${order.customerId}`}>All orders of this customer</Link>
          </dd>
        </dl>
      </div>

      <div className="card">
        <h2>Books in this order</h2>
        <OrderItemsTable items={order.items} />

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

      {pendingStatus && (
        <ConfirmDialog
          title={STATUS_ACTION_LABELS[pendingStatus]}
          message={STATUS_CONFIRM_MESSAGES[pendingStatus]}
          confirmLabel={pendingStatus === "CANCELLED" ? "Yes, cancel order" : "Yes, continue"}
          confirmVariant={pendingStatus === "CANCELLED" ? "danger" : "primary"}
          busy={updating}
          onConfirm={handleConfirm}
          onCancel={() => setPendingStatus(null)}
        />
      )}
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();

  // key = a fresh view (with fresh state) for every order id
  return <AdminOrderDetailsView key={orderId} orderId={orderId} />;
}
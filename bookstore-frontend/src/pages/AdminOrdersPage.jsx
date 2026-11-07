import { Link, useLocation } from "react-router-dom";
import { getAdminOrders } from "../api/adminApi";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import useFetch from "../hooks/useFetch";
import useUrlParams from "../hooks/useUrlParams";
import { ORDER_STATUSES, statusLabel } from "../utils/orderStatus";
import { formatDateTime, formatPrice } from "../utils/format";

const PAGE_SIZE = 10;
const DEFAULT_SORT = "orderDate,desc";

const SORT_OPTIONS = [
  { value: "orderDate,desc", label: "Newest first" },
  { value: "orderDate,asc", label: "Oldest first" },
  { value: "totalAmount,desc", label: "Amount: high to low" },
  { value: "totalAmount,asc", label: "Amount: low to high" },
];

const STATUS_TABS = [
  { value: "", label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: statusLabel(status) })),
];

export default function AdminOrdersPage() {
  const { searchParams, updateParams } = useUrlParams();
  const location = useLocation();

  // ---------- Read from the URL (with safe values) ----------
  const requestedStatus = searchParams.get("status") || "";
  const status = ORDER_STATUSES.includes(requestedStatus) ? requestedStatus : "";
  const requestedCustomer = searchParams.get("customerId") || "";
  const customerId = /^\d+$/.test(requestedCustomer) ? requestedCustomer : "";
  const requestedSort = searchParams.get("sort");
  const sort = SORT_OPTIONS.some((option) => option.value === requestedSort)
    ? requestedSort
    : DEFAULT_SORT;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const [sortBy, direction] = sort.split(",");

  // ---------- Load data ----------
  const { data, loading, error } = useFetch(
    () =>
      getAdminOrders({
        status: status || undefined,
        customerId: customerId || undefined,
        page: page - 1,
        size: PAGE_SIZE,
        sortBy,
        direction,
      }),
    [status, customerId, sort, page]
  );

  const handleStatusChange = (newStatus) => updateParams({ status: newStatus, page: "" });
  const handleSortChange = (event) =>
    updateParams({ sort: event.target.value === DEFAULT_SORT ? "" : event.target.value, page: "" });
  const handlePageChange = (newPage) => {
    updateParams({ page: newPage === 1 ? "" : String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkState = { from: `${location.pathname}${location.search}` };

  // ---------- What to show ----------
  let content;
  if (error) {
    content = <p className="alert alert-error">{error}</p>;
  } else if (!data) {
    content = <p>Loading orders...</p>;
  } else if (data.content.length === 0) {
    content = (
      <div className="card empty-state">
        <p>{data.totalElements > 0 ? "This page does not exist." : "No orders found."}</p>
      </div>
    );
  } else {
    content = (
      <>
        <p className="muted">
          {data.totalElements} {data.totalElements === 1 ? "order" : "orders"} found
        </p>

        <div className={loading ? "card table-wrap is-loading" : "card table-wrap"}>
          <table className="items-table admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Books</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <Link to={`/admin/orders/${order.orderId}`} state={linkState}>
                      <strong>#{order.orderId}</strong>
                    </Link>
                    <p className="muted small">{formatDateTime(order.orderDate)}</p>
                  </td>
                  <td>
                    {order.customerName}
                    <p className="muted small">{order.customerEmail}</p>
                  </td>
                  <td>{order.totalItems}</td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td>
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${order.orderId}`}
                      state={linkState}
                      className="btn btn-outline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <select value={sort} onChange={handleSortChange} aria-label="Sort orders">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="status-tabs" role="tablist">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={status === tab.value}
            className={status === tab.value ? "status-tab active" : "status-tab"}
            onClick={() => handleStatusChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {customerId && (
        <p className="filter-chip">
          Showing orders of customer #{customerId}
          {data?.content[0] && ` (${data.content[0].customerName})`}
          <button type="button" onClick={() => updateParams({ customerId: "", page: "" })}>
            ✕ Clear
          </button>
        </p>
      )}

      {content}
    </div>
  );
}
import { Link, useLocation } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import useFetch from "../hooks/useFetch";
import useUrlParams from "../hooks/useUrlParams";
import { formatDateTime, formatPrice } from "../utils/format";

const PAGE_SIZE = 5;
const DEFAULT_SORT = "orderDate,desc";

const SORT_OPTIONS = [
  { value: "orderDate,desc", label: "Newest first" },
  { value: "orderDate,asc", label: "Oldest first" },
  { value: "totalAmount,desc", label: "Amount: high to low" },
  { value: "totalAmount,asc", label: "Amount: low to high" },
];

export default function OrdersPage() {
  const { searchParams, updateParams } = useUrlParams();
  const location = useLocation();

  // ---------- Read from the URL (with safe defaults) ----------
  const requestedSort = searchParams.get("sort");
  const sort = SORT_OPTIONS.some((option) => option.value === requestedSort)
    ? requestedSort
    : DEFAULT_SORT;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const [sortBy, direction] = sort.split(",");

  // ---------- Load data ----------
  const { data, loading, error } = useFetch(
    () => getMyOrders({ page: page - 1, size: PAGE_SIZE, sortBy, direction }),
    [sort, page]
  );

  const handleSortChange = (event) =>
    updateParams({ sort: event.target.value === DEFAULT_SORT ? "" : event.target.value, page: "" });

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage === 1 ? "" : String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The details page uses this to build its "Back" link
  const linkState = { from: `${location.pathname}${location.search}` };

  // ---------- What to show ----------
  let content;
  if (error) {
    content = <p className="alert alert-error">{error}</p>;
  } else if (!data) {
    content = <p>Loading your orders...</p>;
  } else if (data.content.length === 0) {
    content = (
      <div className="card empty-state">
        <p>{data.totalElements > 0 ? "This page does not exist." : "You have not placed any orders yet."}</p>
        {data.totalElements > 0 ? (
          <button type="button" className="btn btn-outline" onClick={() => updateParams({ page: "" })}>
            Go to first page
          </button>
        ) : (
          <Link to="/" className="btn btn-primary">
            Browse books
          </Link>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <div className={loading ? "order-list is-loading" : "order-list"}>
          {data.content.map((order) => (
            <div className="card order-row" key={order.orderId}>
              <div>
                <h3>
                  <Link to={`/orders/${order.orderId}`} state={linkState}>
                    Order #{order.orderId}
                  </Link>
                </h3>
                <p className="muted">{formatDateTime(order.orderDate)}</p>
              </div>

              <div>
                <p>
                  {order.totalItems} {order.totalItems === 1 ? "book" : "books"}
                </p>
                <p className="price">{formatPrice(order.totalAmount)}</p>
              </div>

              <div className="order-badges">
                <StatusBadge status={order.orderStatus} />
                <span className="muted small">
                  Payment: <StatusBadge status={order.paymentStatus} />
                </span>
              </div>

              <Link to={`/orders/${order.orderId}`} state={linkState} className="btn btn-outline">
                View details
              </Link>
            </div>
          ))}
        </div>

        <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Orders</h1>
        <select value={sort} onChange={handleSortChange} aria-label="Sort orders">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {content}
    </div>
  );
}
import { Link } from "react-router-dom";
import { getDashboard } from "../api/adminApi";
import useFetch from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import { statusLabel } from "../utils/orderStatus";

// Each order status gets its own icon and colour tone
const STATUS_LOOK = {
  PLACED: { icon: "🆕", tone: "sky" },
  CONFIRMED: { icon: "✅", tone: "indigo" },
  SHIPPED: { icon: "🚚", tone: "amber" },
  DELIVERED: { icon: "📦", tone: "emerald" },
  CANCELLED: { icon: "❌", tone: "rose" },
};

function StatCard({ label, value, to, icon, tone = "indigo" }) {
  const body = (
    <>
      <span className="stat-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="muted">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </>
  );

  const className = `card stat-card has-icon tone-${tone}`;

  if (to) {
    return (
      <Link to={to} className={`${className} stat-link`}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useFetch(getDashboard);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <StatCard label="Books" value={data.totalBooks} to="/admin/books" icon="📚" tone="indigo" />
        <StatCard label="Categories" value={data.totalCategories} to="/admin/categories" icon="🏷️" tone="violet" />
        <StatCard label="Customers" value={data.totalCustomers} to="/admin/customers" icon="👥" tone="sky" />
        <StatCard label="Orders" value={data.totalOrders} to="/admin/orders" icon="🧾" tone="amber" />
        <StatCard label="Total sales" value={formatPrice(data.totalSales)} to="/admin/sales" icon="💰" tone="emerald" />
        <StatCard
          label={`Low stock (≤ ${data.lowStockThreshold})`}
          value={data.lowStockBooks}
          to="/admin/books?sort=title,asc"
          icon="⚠️"
          tone="rose"
        />
      </div>

      <h2 className="section-title">Orders by status</h2>
      <div className="stats-grid">
        {Object.entries(data.ordersByStatus).map(([status, count]) => (
          <StatCard
            key={status}
            label={statusLabel(status)}
            value={count}
            to={`/admin/orders?status=${status}`}
            icon={STATUS_LOOK[status].icon}
            tone={STATUS_LOOK[status].tone}
          />
        ))}
      </div>
    </div>
  );
}
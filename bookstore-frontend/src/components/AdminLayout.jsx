import { NavLink, Outlet, useLocation } from "react-router-dom";

const MENU = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/orders", label: "Orders", icon: "🧾" },
  { to: "/admin/customers", label: "Customers", icon: "👥" },
  { to: "/admin/sales", label: "Sales", icon: "💰" },
  { to: "/admin/books", label: "Books", icon: "📚" },
  { to: "/admin/categories", label: "Categories", icon: "🏷️" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
            >
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="admin-content page-enter" key={location.pathname}>
        <Outlet />
      </section>
    </div>
  );
}
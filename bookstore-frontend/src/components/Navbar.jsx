import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import ThemeMenu from "./ThemeMenu";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">📚</span>
          <span className="brand-text">Online Book Store</span>
        </Link>

        {/* Any click on a link (or Logout) closes the mobile menu */}
        <nav className={menuOpen ? "nav-links open" : "nav-links"} onClick={() => setMenuOpen(false)}>
          <NavLink to="/" end className={linkClass}>
            Books
          </NavLink>

          {isCustomer && (
            <>
              <NavLink to="/cart" className={linkClass}>
                🛒 Cart
                {cartCount > 0 && (
                  // key = a new element each time the count changes, so the "pop" animation plays again
                  <span key={cartCount} className="cart-badge">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                My Orders
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button type="button" className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          <ThemeMenu />
          <button
            type="button"
            className="icon-button menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
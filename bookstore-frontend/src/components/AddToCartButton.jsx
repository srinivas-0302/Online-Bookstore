import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";

export default function AddToCartButton({ book, quantity = 1, className = "btn btn-primary" }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Admins do not shop in our store
  if (isAdmin) return null;

  const outOfStock = book.stockQuantity <= 0;

  const handleClick = async () => {
    if (!isAuthenticated) {
      showToast("Please login to add books to your cart", "info");
      navigate("/login", { state: { from: location } });
      return;
    }

    setBusy(true);
    try {
      await addItem(book.bookId, quantity);
      showToast(`"${book.title}" added to your cart`);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setBusy(false);
    }
  };

  let label = "Add to cart";
  if (outOfStock) label = "Out of stock";
  else if (busy) label = "Adding...";
  else if (justAdded) label = "✓ Added";

  return (
    <button
      type="button"
      className={justAdded ? `${className} btn-success` : className}
      disabled={outOfStock || busy}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
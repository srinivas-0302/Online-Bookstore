import { useState } from "react";
import { Link } from "react-router-dom";
import BookCover from "../components/BookCover";
import QuantitySelector from "../components/QuantitySelector";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import { formatPrice } from "../utils/format";

const MAX_QUANTITY = 100;

export default function CartPage() {
  const { cart, cartLoading, cartError, updateItem, removeItem, clearCart } = useCart();
  const { showToast } = useToast();

  const [busyItemId, setBusyItemId] = useState(null);
  const [clearing, setClearing] = useState(false);

  // Runs one cart action for one item, with busy state and error toast
  const runItemAction = async (cartItemId, action, successMessage) => {
    setBusyItemId(cartItemId);
    try {
      await action();
      if (successMessage) showToast(successMessage);
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleQuantityChange = (item, quantity) =>
    runItemAction(item.cartItemId, () => updateItem(item.cartItemId, quantity));

  const handleRemove = (item) =>
    runItemAction(
      item.cartItemId,
      () => removeItem(item.cartItemId),
      `"${item.title}" removed from your cart`
    );

  const handleClear = async () => {
    if (!window.confirm("Remove all books from your cart?")) return;

    setClearing(true);
    try {
      await clearCart();
      showToast("Your cart is now empty");
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setClearing(false);
    }
  };

  if (cartLoading) return <p>Loading your cart...</p>;
  if (cartError) return <p className="alert alert-error">{cartError}</p>;

  if (cart.items.length === 0) {
    return (
      <div className="card empty-state">
        <h1>Your cart is empty</h1>
        <p className="muted">Find something good to read.</p>
        <Link to="/" className="btn btn-primary">
          Browse books
        </Link>
      </div>
    );
  }

  const hasStockProblem = cart.items.some((item) => item.quantity > item.availableStock);

  return (
    <div>
      <h1>My Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => {
            const busy = busyItemId === item.cartItemId || clearing;
            const itemProblem = item.quantity > item.availableStock;

            return (
              <div className={busy ? "card cart-item is-loading" : "card cart-item"} key={item.cartItemId}>
                <Link to={`/books/${item.bookId}`}>
                  <BookCover imageUrl={item.imageUrl} title={item.title} />
                </Link>

                <div className="cart-item-info">
                  <h3>
                    <Link to={`/books/${item.bookId}`}>{item.title}</Link>
                  </h3>
                  <p className="muted">{item.author}</p>
                  <p>{formatPrice(item.price)} each</p>
                  {itemProblem && (
                    <p className="out-of-stock">
                      {item.availableStock === 0
                        ? "This book is now out of stock."
                        : `Only ${item.availableStock} left in stock.`}{" "}
                      Please update the quantity.
                    </p>
                  )}
                </div>

                <div className="cart-item-actions">
                  <QuantitySelector
                    value={item.quantity}
                    max={Math.min(item.availableStock, MAX_QUANTITY)}
                    onChange={(quantity) => handleQuantityChange(item, quantity)}
                    disabled={busy}
                  />
                  <p className="price">{formatPrice(item.subtotal)}</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleRemove(item)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card cart-summary">
          <h2>Order summary</h2>
          <dl className="details">
            <dt>Books</dt>
            <dd>{cart.totalItems}</dd>
            <dt>Total</dt>
            <dd className="price">{formatPrice(cart.totalAmount)}</dd>
          </dl>

          <p className="muted small">
            Prices in the cart are today's prices. The final price is fixed when you place the order.
          </p>

          {hasStockProblem ? (
            <>
              <p className="alert alert-error">Please fix the stock problems above to continue.</p>
              <button type="button" className="btn btn-primary btn-block" disabled>
                Proceed to checkout
              </button>
            </>
          ) : (
            <Link to="/checkout" className="btn btn-primary btn-block">
              Proceed to checkout
            </Link>
          )}

          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={handleClear}
            disabled={clearing}
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
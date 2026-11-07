import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getBookById } from "../api/bookApi";
import AddToCartButton from "../components/AddToCartButton";
import BookCover from "../components/BookCover";
import QuantitySelector from "../components/QuantitySelector";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { formatDate, formatPrice } from "../utils/format";
import { categoryHue } from "../utils/colors";

const MAX_QUANTITY = 100;

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const backTo = location.state?.from || "/";

  const { data: book, loading, error } = useFetch(() => getBookById(bookId), [bookId]);

  if (loading) return <p>Loading book...</p>;

  if (error) {
    return (
      <div>
        <p className="alert alert-error">{error}</p>
        <Link to="/">← Back to books</Link>
      </div>
    );
  }

  const inStock = book.stockQuantity > 0;
  const maxQuantity = Math.min(book.stockQuantity, MAX_QUANTITY);
  const safeQuantity = Math.min(quantity, Math.max(maxQuantity, 1));

  return (
    <div>
      <Link to={backTo}>← Back to books</Link>

      <div className="card details-layout">
        <BookCover imageUrl={book.imageUrl} title={book.title} large />

        <div>
          <span className="badge" style={{ "--cat-hue": categoryHue(book.categoryName) }}>
  {book.categoryName}
</span>
          <h1>{book.title}</h1>
          <p className="muted">by {book.author}</p>

          <p className="price price-large">{formatPrice(book.price)}</p>
          <p className={inStock ? "in-stock" : "out-of-stock"}>
            {inStock ? `${book.stockQuantity} copies available` : "Out of stock"}
          </p>

          <div className="buy-box">
            {!isAdmin && inStock && (
              <QuantitySelector value={safeQuantity} max={maxQuantity} onChange={setQuantity} />
            )}
            <AddToCartButton book={book} quantity={safeQuantity} />
          </div>

          <h2>About this book</h2>
          <p className="book-description">{book.description || "No description available."}</p>

          <dl className="details">
            <dt>ISBN</dt>
            <dd>{book.isbn}</dd>
            <dt>Published</dt>
            <dd>{formatDate(book.publishedDate)}</dd>
            <dt>Added to store</dt>
            <dd>{formatDate(book.createdAt?.slice(0, 10))}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
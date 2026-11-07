import { Link, useLocation } from "react-router-dom";
import { categoryHue } from "../utils/colors";
import { formatPrice } from "../utils/format";
import AddToCartButton from "./AddToCartButton";
import BookCover from "./BookCover";

const LOW_STOCK_LIMIT = 5;

export default function BookCard({ book }) {
  const location = useLocation();

  const detailsLink = `/books/${book.bookId}`;
  const linkState = { from: `${location.pathname}${location.search}` };

  let stockText = "In stock";
  let stockClass = "in-stock";
  if (book.stockQuantity <= 0) {
    stockText = "Out of stock";
    stockClass = "out-of-stock";
  } else if (book.stockQuantity <= LOW_STOCK_LIMIT) {
    stockText = `Only ${book.stockQuantity} left`;
    stockClass = "low-stock";
  }

  return (
    <div className="card book-card" style={{ "--cat-hue": categoryHue(book.categoryName) }}>
      <Link to={detailsLink} state={linkState}>
        <BookCover imageUrl={book.imageUrl} title={book.title} />
      </Link>
      <span className="badge">{book.categoryName}</span>
      <h3>
        <Link to={detailsLink} state={linkState}>
          {book.title}
        </Link>
      </h3>
      <p className="muted">{book.author}</p>
      <p className="price">{formatPrice(book.price)}</p>
      <p className={stockClass}>{stockText}</p>

      <div className="card-actions">
        <AddToCartButton book={book} className="btn btn-primary btn-block" />
      </div>
    </div>
  );
}
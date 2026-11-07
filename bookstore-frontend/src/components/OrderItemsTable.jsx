import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import BookCover from "./BookCover";

export default function OrderItemsTable({ items }) {
  return (
    <div className="table-wrap">
      <table className="items-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Price paid</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.orderItemId}>
              <td>
                <div className="item-book">
                  <BookCover imageUrl={item.imageUrl} title={item.title} />
                  <div>
                    <Link to={`/books/${item.bookId}`}>{item.title}</Link>
                    <p className="muted small">{item.author}</p>
                  </div>
                </div>
              </td>
              <td>{formatPrice(item.priceAtPurchase)}</td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook } from "../api/adminApi";
import { getBooks } from "../api/bookApi";
import { getCategories } from "../api/categoryApi";
import BookCover from "../components/BookCover";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import useFetch from "../hooks/useFetch";
import useToast from "../hooks/useToast";
import useUrlParams from "../hooks/useUrlParams";
import { BOOK_SORT_OPTIONS, DEFAULT_BOOK_SORT } from "../utils/bookSort";
import { parseApiError } from "../utils/errorHelper";
import { formatPrice } from "../utils/format";

const PAGE_SIZE = 10;

function stockClass(stock) {
  if (stock <= 0) return "out-of-stock";
  if (stock <= 5) return "low-stock";
  return "";
}

export default function AdminBooksPage() {
  const { searchParams, updateParams, clearParams } = useUrlParams();
  const { showToast } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ---------- Read from the URL ----------
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const requestedSort = searchParams.get("sort");
  const sort = BOOK_SORT_OPTIONS.some((option) => option.value === requestedSort)
    ? requestedSort
    : DEFAULT_BOOK_SORT;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const [sortBy, direction] = sort.split(",");

  // ---------- Load data ----------
  const { data: categories } = useFetch(getCategories);

  const { data, loading, error } = useFetch(
    () =>
      getBooks({
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
        page: page - 1,
        size: PAGE_SIZE,
        sortBy,
        direction,
      }),
    [keyword, categoryId, sort, page, refreshKey]
  );

  // ---------- Handlers ----------
  const handleSearch = (text) => updateParams({ keyword: text, page: "" });
  const handleCategoryChange = (event) => updateParams({ categoryId: event.target.value, page: "" });
  const handleSortChange = (event) =>
    updateParams({ sort: event.target.value === DEFAULT_BOOK_SORT ? "" : event.target.value, page: "" });
  const handlePageChange = (newPage) =>
    updateParams({ page: newPage === 1 ? "" : String(newPage) });

  const hasFilters = keyword !== "" || categoryId !== "" || sort !== DEFAULT_BOOK_SORT;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(deleteTarget.bookId);
      showToast(`"${deleteTarget.title}" deleted`);

      // If we deleted the only book on the last page, go one page back
      if (data.content.length === 1 && page > 1) {
        updateParams({ page: page - 1 === 1 ? "" : String(page - 1) });
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ---------- What to show ----------
  let content;
  if (error) {
    content = <p className="alert alert-error">{error}</p>;
  } else if (!data) {
    content = <p>Loading books...</p>;
  } else if (data.content.length === 0) {
    content = (
      <div className="card empty-state">
        <p>{data.totalElements > 0 ? "This page does not exist." : "No books found."}</p>
        {hasFilters && (
          <button type="button" className="btn btn-outline" onClick={clearParams}>
            Clear filters
          </button>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <p className="muted">
          {data.totalElements} {data.totalElements === 1 ? "book" : "books"} found
        </p>

        <div className={loading ? "card table-wrap is-loading" : "card table-wrap"}>
          <table className="items-table admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((book) => (
                <tr key={book.bookId}>
                  <td>
                    <div className="item-book">
                      <BookCover imageUrl={book.imageUrl} title={book.title} />
                      <div>
                        <strong>{book.title}</strong>
                        <p className="muted small">
                          {book.author} • ISBN {book.isbn}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{book.categoryName}</td>
                  <td>{formatPrice(book.price)}</td>
                  <td className={stockClass(book.stockQuantity)}>{book.stockQuantity}</td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/admin/books/${book.bookId}/edit`} className="btn btn-outline">
                        Edit
                      </Link>
                      <button type="button" className="btn btn-danger" onClick={() => setDeleteTarget(book)}>
                        Delete
                      </button>
                    </div>
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
        <h1>Manage Books</h1>
        <Link to="/admin/books/new" className="btn btn-primary">
          + Add book
        </Link>
      </div>

      <div className="filters">
        <SearchBar key={keyword} initialValue={keyword} onSearch={handleSearch} />

        <select value={categoryId} onChange={handleCategoryChange} aria-label="Category">
          <option value="">All categories</option>
          {(categories || []).map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>

        <select value={sort} onChange={handleSortChange} aria-label="Sort books">
          {BOOK_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button type="button" className="btn btn-outline" onClick={clearParams}>
            Clear
          </button>
        )}
      </div>

      {content}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this book?"
          message={`"${deleteTarget.title}" will be removed from the store. This cannot be undone. Books that already have orders cannot be deleted.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
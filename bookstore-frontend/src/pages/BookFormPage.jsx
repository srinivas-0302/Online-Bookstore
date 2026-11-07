import { Link, useParams } from "react-router-dom";
import { getBookById } from "../api/bookApi";
import { getCategories } from "../api/categoryApi";
import BookForm from "../components/BookForm";
import useFetch from "../hooks/useFetch";

export default function BookFormPage() {
  const { bookId } = useParams();      // undefined on /admin/books/new
  const isEdit = Boolean(bookId);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(getCategories);

  // In "add" mode there is nothing to load, so we return an already-finished promise
  const {
    data: book,
    loading: bookLoading,
    error: bookError,
  } = useFetch(
    () => (isEdit ? getBookById(bookId) : Promise.resolve({ data: null })),
    [bookId]
  );

  if (categoriesLoading || bookLoading) return <p>Loading...</p>;

  const loadError = categoriesError || bookError;
  if (loadError) {
    return (
      <div>
        <p className="alert alert-error">{loadError}</p>
        <Link to="/admin/books">← Back to books</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/books">← Back to books</Link>
      <h1>{isEdit ? "Edit book" : "Add new book"}</h1>

      {/* key makes React start a fresh form when we move between books */}
      <BookForm key={bookId || "new"} book={book} categories={categories} />
    </div>
  );
}
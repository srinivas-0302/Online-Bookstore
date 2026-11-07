import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, updateBook } from "../api/adminApi";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import BookCover from "./BookCover";
import FormField from "./FormField";

const EMPTY_FORM = {
  title: "",
  author: "",
  description: "",
  price: "",
  categoryId: "",
  isbn: "",
  stockQuantity: "",
  imageUrl: "",
  publishedDate: "",
};

// Backend data -> values for the form inputs (inputs always work with text)
function toFormValues(book) {
  if (!book) return EMPTY_FORM;
  return {
    title: book.title,
    author: book.author,
    description: book.description || "",
    price: String(book.price),
    categoryId: String(book.categoryId),
    isbn: book.isbn,
    stockQuantity: String(book.stockQuantity),
    imageUrl: book.imageUrl || "",
    publishedDate: book.publishedDate || "",
  };
}

// Form values -> JSON body for the backend (empty -> null, numbers -> numbers)
function toRequestBody(form) {
  const textOrNull = (value) => (value.trim() === "" ? null : value.trim());
  const numberOrNull = (value) => (value === "" ? null : Number(value));

  return {
    title: form.title.trim(),
    author: form.author.trim(),
    description: textOrNull(form.description),
    price: numberOrNull(form.price),
    categoryId: numberOrNull(form.categoryId),
    isbn: form.isbn.trim(),
    stockQuantity: numberOrNull(form.stockQuantity),
    imageUrl: textOrNull(form.imageUrl),
    publishedDate: form.publishedDate === "" ? null : form.publishedDate,
  };
}

export default function BookForm({ book, categories }) {
  const isEdit = Boolean(book);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(() => toFormValues(book));
  const [previewUrl, setPreviewUrl] = useState(() => (book ? book.imageUrl || "" : ""));
  const [error, setError] = useState({ message: "", fieldErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError({ message: "", fieldErrors: {} });

    try {
      const body = toRequestBody(form);
      if (isEdit) {
        await updateBook(book.bookId, body);
      } else {
        await createBook(body);
      }
      showToast(`"${body.title}" saved`);
      navigate("/admin/books");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      {error.message && <p className="alert alert-error">{error.message}</p>}

      <div className="form-grid">
        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={error.fieldErrors.title}
        />
        <FormField
          label="Author"
          name="author"
          value={form.author}
          onChange={handleChange}
          error={error.fieldErrors.author}
        />

        <FormField
          as="select"
          label="Category"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          error={error.fieldErrors.categoryId}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </FormField>
        <FormField
          label="ISBN"
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          error={error.fieldErrors.isbn}
        />

        <FormField
          label="Price (₹)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          error={error.fieldErrors.price}
        />
        <FormField
          label="Stock quantity"
          name="stockQuantity"
          type="number"
          step="1"
          min="0"
          value={form.stockQuantity}
          onChange={handleChange}
          error={error.fieldErrors.stockQuantity}
        />

        <FormField
          label="Published date"
          name="publishedDate"
          type="date"
          value={form.publishedDate}
          onChange={handleChange}
          error={error.fieldErrors.publishedDate}
        />
        <FormField
          label="Image URL (optional)"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          onBlur={() => setPreviewUrl(form.imageUrl.trim())}
          error={error.fieldErrors.imageUrl}
          placeholder="https://..."
        />
      </div>

      <FormField
        as="textarea"
        rows={5}
        label="Description (optional)"
        name="description"
        value={form.description}
        onChange={handleChange}
        error={error.fieldErrors.description}
      />

      <div className="form-preview">
        <p className="muted small">Cover preview (updates when you leave the image field)</p>
        <BookCover key={previewUrl} imageUrl={previewUrl} title={form.title || "Book cover"} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/books")}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add book"}
        </button>
      </div>
    </form>
  );
}
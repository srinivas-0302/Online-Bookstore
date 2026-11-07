import { useState } from "react";
import { createCategory, updateCategory } from "../api/adminApi";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import FormField from "./FormField";

// category = the category being edited, or null when adding a new one
export default function CategoryForm({ category, onSaved, onCancel }) {
  const isEdit = Boolean(category);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: category ? category.name : "",
    description: category ? category.description || "" : "",
  });
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

    const body = {
      name: form.name.trim(),
      description: form.description.trim() === "" ? null : form.description.trim(),
    };

    try {
      if (isEdit) {
        await updateCategory(category.categoryId, body);
      } else {
        await createCategory(body);
      }
      showToast(isEdit ? "Category updated" : "Category added");
      onSaved();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{isEdit ? `Edit category: ${category.name}` : "Add category"}</h2>

      {error.message && <p className="alert alert-error">{error.message}</p>}

      <div className="form-grid">
        <FormField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={error.fieldErrors.name}
        />
        <FormField
          label="Description (optional)"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={error.fieldErrors.description}
        />
      </div>

      <div className="form-actions">
        {isEdit && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}
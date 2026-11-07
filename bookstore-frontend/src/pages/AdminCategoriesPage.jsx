import { useState } from "react";
import { deleteCategory } from "../api/adminApi";
import { getCategories } from "../api/categoryApi";
import CategoryForm from "../components/CategoryForm";
import ConfirmDialog from "../components/ConfirmDialog";
import useFetch from "../hooks/useFetch";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);          // category being edited, or null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: categories, loading, error } = useFetch(getCategories, [refreshKey]);

  const reload = () => setRefreshKey((key) => key + 1);

  const handleSaved = () => {
    setEditing(null);
    reload();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.categoryId);
      showToast(`Category "${deleteTarget.name}" deleted`);
      if (editing && editing.categoryId === deleteTarget.categoryId) setEditing(null);
      reload();
    } catch (err) {
      showToast(parseApiError(err).message, "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  let table;
  if (error) {
    table = <p className="alert alert-error">{error}</p>;
  } else if (!categories) {
    table = <p>Loading categories...</p>;
  } else if (categories.length === 0) {
    table = <p className="muted">No categories yet. Add the first one above.</p>;
  } else {
    table = (
      <div className={loading ? "card table-wrap is-loading" : "card table-wrap"}>
        <table className="items-table admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>
                  <strong>{category.name}</strong>
                </td>
                <td className="muted">{category.description || "-"}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditing(category);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => setDeleteTarget(category)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h1>Manage Categories</h1>

      {/* key = start a fresh form whenever we switch between add and edit */}
      <CategoryForm
        key={editing ? editing.categoryId : "new"}
        category={editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />

      <h2 className="section-title">All categories</h2>
      {table}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this category?"
          message={`"${deleteTarget.name}" will be deleted. A category that still has books cannot be deleted.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
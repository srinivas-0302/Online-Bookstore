import { useState } from "react";
import { changePasswordRequest } from "../api/profileApi";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import FormField from "./FormField";

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordForm() {
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
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
      await changePasswordRequest(form);
      setForm(EMPTY_FORM);
      showToast("Password changed successfully");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>Change password</h2>

      {error.message && <p className="alert alert-error">{error.message}</p>}

      <FormField
        label="Current password"
        name="currentPassword"
        type="password"
        value={form.currentPassword}
        onChange={handleChange}
        error={error.fieldErrors.currentPassword}
        autoComplete="current-password"
      />
      <FormField
        label="New password"
        name="newPassword"
        type="password"
        value={form.newPassword}
        onChange={handleChange}
        error={error.fieldErrors.newPassword}
        autoComplete="new-password"
      />
      <FormField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={error.fieldErrors.confirmPassword}
        autoComplete="new-password"
      />

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
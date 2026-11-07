import { useState } from "react";
import { updateProfile } from "../api/profileApi";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { parseApiError } from "../utils/errorHelper";
import FormField from "./FormField";

export default function ProfileForm({ profile, onSaved }) {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: profile.name, phone: profile.phone || "" });
  const [error, setError] = useState({ message: "", fieldErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  // Is there anything to save?
  const unchanged =
    form.name.trim() === profile.name && form.phone.trim() === (profile.phone || "");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError({ message: "", fieldErrors: {} });

    try {
      const response = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim() === "" ? null : form.phone.trim(),
      });
      const saved = response.data;

      onSaved(saved);                                  // refresh the profile card
      updateUser({ name: saved.name });                // refresh the Navbar greeting
      setForm({ name: saved.name, phone: saved.phone || "" });
      showToast("Profile updated");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>Edit profile</h2>

      {error.message && <p className="alert alert-error">{error.message}</p>}

      <FormField label="Email (cannot be changed)" name="email" value={profile.email} disabled readOnly />
      <FormField
        label="Full name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={error.fieldErrors.name}
        autoComplete="name"
      />
      <FormField
        label="Mobile number"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        error={error.fieldErrors.phone}
        autoComplete="tel"
      />

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting || unchanged}>
        {submitting ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
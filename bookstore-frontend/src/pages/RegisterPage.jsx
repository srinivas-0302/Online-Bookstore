import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/authApi";
import FormField from "../components/FormField";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../utils/errorHelper";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState({ message: "", fieldErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError({ message: "", fieldErrors: {} });

    try {
      await registerRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() === "" ? null : form.phone.trim(),   // empty phone -> null
      });
      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please login." },
      });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1>Create Account</h1>

      {error.message && <p className="alert alert-error">{error.message}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={error.fieldErrors.name}
          autoComplete="name"
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={error.fieldErrors.email}
          autoComplete="email"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={error.fieldErrors.password}
          autoComplete="new-password"
        />
        <FormField
          label="Mobile number (optional)"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={error.fieldErrors.phone}
          autoComplete="tel"
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
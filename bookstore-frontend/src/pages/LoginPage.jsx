import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import FormField from "../components/FormField";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../utils/errorHelper";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({ message: "", fieldErrors: {} });
  const [submitting, setSubmitting] = useState(false);

  // Once logged in, go back to the page the user wanted, or to a default page
   if (isAuthenticated) {
    const from = location.state?.from;
    const destination = from
      ? `${from.pathname}${from.search || ""}`
      : isAdmin
        ? "/admin"
        : "/";
    return <Navigate to={destination} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();             // stop the browser's normal form reload
    setSubmitting(true);
    setError({ message: "", fieldErrors: {} });

    try {
      await login(form.email.trim(), form.password);
      // No navigate() needed. The block above redirects once the user is set.
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1>Login</h1>

      {location.state?.message && (
        <p className="alert alert-success">{location.state.message}</p>
      )}
      {error.message && <p className="alert alert-error">{error.message}</p>}

      <form onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="muted">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
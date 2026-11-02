
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Registration does not automatically log the user in.
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please try again."
          : err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          🛒 ShopNest
        </Link>

        <p className="auth-eyebrow">JOIN SHOPNEST</p>

        <h1>Create your account</h1>

        <p className="auth-description">
          Sign up to enjoy a better shopping experience.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              minLength={2}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="registerEmail">Email Address</label>
            <input
              id="registerEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="registerPassword">Password</label>
            <input
              id="registerPassword"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Enter your password again"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="auth-form-message" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-form-message" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="auth-back-home">
          ← Back to Home
        </Link>
      </section>
    </div>
  );
}

export default Register;

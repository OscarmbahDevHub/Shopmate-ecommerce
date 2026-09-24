import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";

function Register({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Name validation
    if (trimmedName.length < 2) {
      setError(
        "❌ Please enter your full name."
      );
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError(
        "❌ Please enter a valid email address."
      );
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError(
        "❌ Passwords do not match."
      );
      return;
    }

    // Basic password length
    if (password.length < 6) {
      setError(
        "❌ Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://shopmate-ecommerce-a8o8.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          `❌ ${
            data.message ||
            "Registration failed. Please try again."
          }`
        );
        return;
      }

      if (!data.token || !data.user) {
        setError(
          "❌ Registration succeeded, but the server returned an invalid response."
        );
        return;
      }

      // Save authentication token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update application state
      setUser(data.user);

      toast.success(
        `🎉 Welcome to ShopMate, ${data.user.name}!`
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setError(
        "❌ Unable to connect to the server. Please make sure the ShopMate backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="login-page">
        <div className="login-card">
          <h1>Create Account 🎉</h1>

          <p>
            Join ShopMate and start shopping today.
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              disabled={loading}
              required
            />

            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
              required
            />

            <div className="password-box">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                required
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>

            <div className="password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );
                  setError("");
                }}
                disabled={loading}
                required
              />

              <button
                type="button"
                className="show-password-btn"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}
              </button>
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                {error}
              </p>
            )}

            <div className="terms-box">
              <label>
                <input
                  type="checkbox"
                  required
                  disabled={loading}
                />{" "}
                I agree to the{" "}
                <a href="#">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="login-footer">
            Already have an account?{" "}
            <Link to="/login">
              <strong>Login</strong>
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Register;
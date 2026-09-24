import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";

function Login({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      toast.error(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
        toast.error(
          data.message ||
            "Invalid email or password."
        );
        return;
      }

      if (!data.token || !data.user) {
        toast.error(
          "The server returned an invalid login response."
        );
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Update React user state
      setUser(data.user);

      toast.success(
        `Welcome back, ${data.user.name}! 👋`
      );

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        "Unable to connect to the server. Please make sure the ShopMate backend is running."
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
          <h1>Welcome Back 👋</h1>

          <p>
            Sign in to continue shopping.
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
                placeholder="Enter your Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  disabled={loading}
                />
                Remember Me
              </label>

              <a href="#">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register">
              <strong>Register</strong>
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
}

export default Login;
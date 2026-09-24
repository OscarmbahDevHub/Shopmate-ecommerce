import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

    toast.success("👋 Logged out successfully!");

    navigate("/");
  };

  const handleSearch = () => {
    navigate("/products");
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link
          to="/"
          className="logo"
          style={{ textDecoration: "none" }}
        >
          🛍 ShopMate
        </Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            className="search-btn"
            onClick={handleSearch}
          >
            🔍
          </button>
        </div>

        <div className="nav-icons">
          <Link to="/wishlist">
            🤍 Wishlist
          </Link>

          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <Link to="/orders">
                📦 My Orders
              </Link>

              {user.role === "admin" && (
                <>
                  <Link to="/admin/orders">
                    🛠 Admin Orders
                  </Link>

                  <Link to="/admin/products">
                    🛍 Admin Products
                  </Link>

                  <Link to="/admin/users">
                      👥 Admin Users
                  </Link>
                </>
              )}

              <span
                style={{
                  fontWeight: "600",
                  color: "#2563eb",
                }}
              >
                👋 Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#ef4444",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              👤 Account
            </Link>
          )}
        </div>
      </div>

      <div className="navbar-bottom">
        <ul className="bottom-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Shop</Link>
          </li>

          <li>
            <Link to="/categories">Categories</Link>
          </li>

          <li>
            <Link to="/deals">Deals</Link>
          </li>

          <li>
            <Link to="/about">About Us</Link>
          </li>

          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
import { Link, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function OrderSuccess({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const location = useLocation();

  const order = location.state?.order;

  const orderId = order?._id;

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="success-page">
        <div className="success-card">

          <div className="success-icon">
            ✅
          </div>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with ShopMate.
            Your order has been received and is
            being processed.
          </p>

          {orderId && (
            <div className="order-number">
              <strong>Order ID:</strong>{" "}
              {orderId}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="success-btn"
              >
                📦 View Order
              </Link>
            )}

            <Link
              to="/"
              className="success-btn"
            >
              🛍 Continue Shopping
            </Link>
          </div>

        </div>
      </section>
    </MainLayout>
  );
}

export default OrderSuccess;
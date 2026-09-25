import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

function OrderDetails({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login to view this order.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `https://shopmate-ecommerce-a8o8.onrender.com/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.message || "Unable to load order."
          );
          return;
        }

        setOrder(data.order || null);
      } catch (error) {
        console.error("Fetch Order Error:", error);

        toast.error(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "order-status pending";

      case "Processing":
        return "order-status processing";

      case "Shipped":
        return "order-status shipped";

      case "Delivered":
        return "order-status delivered";

      case "Cancelled":
        return "order-status cancelled";

      default:
        return "order-status";
    }
  };

  if (loading) {
    return (
      <MainLayout
        cartCount={cartCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        setUser={setUser}
      >
        <section className="orders-page">
          <Loading />
        </section>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout
        cartCount={cartCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        setUser={setUser}
      >
        <section className="orders-page">
          <div className="orders-empty">
            <h2>Order not found</h2>

            <p>
              We couldn't find this order.
            </p>

            <button
              className="cart-btn"
              onClick={() => navigate("/orders")}
            >
              ← Back to My Orders
            </button>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="orders-page">

        {/* =========================
            ORDER HEADER
        ========================= */}

        <div className="section-header">
          <h1>
            Order #
            {order._id.slice(-8).toUpperCase()}
          </h1>

          <p>
            Placed on{" "}
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        {/* =========================
            ORDER STATUS
        ========================= */}

        <div className="order-card">

          <div className="order-header">
            <div>
              <h2>Order Status</h2>

              <p>
                Current status of your order
              </p>
            </div>

            <span
              className={getStatusClass(
                order.status
              )}
            >
              {order.status}
            </span>
          </div>

          <hr />

          {/* =========================
              STATUS PROGRESS
          ========================= */}

          {order.status !== "Cancelled" && (
            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <h2>Order Progress</h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                ].map((status) => {
                  const statuses = [
                    "Pending",
                    "Processing",
                    "Shipped",
                    "Delivered",
                  ];

                  const currentIndex =
                    statuses.indexOf(
                      order.status
                    );

                  const statusIndex =
                    statuses.indexOf(
                      status
                    );

                  const completed =
                    statusIndex <=
                    currentIndex;

                  return (
                    <div
                      key={status}
                      style={{
                        flex: "1",
                        minWidth: "120px",
                        textAlign: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        background: completed
                          ? "#2563eb"
                          : "#e5e7eb",
                        color: completed
                          ? "#ffffff"
                          : "#6b7280",
                        fontWeight: "600",
                      }}
                    >
                      {completed
                        ? "✓ "
                        : ""}
                      {status}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === "Cancelled" && (
            <div
              style={{
                padding: "15px",
                marginBottom: "25px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#991b1b",
                fontWeight: "600",
              }}
            >
              ❌ This order has been cancelled.
            </div>
          )}

          <hr />

          {/* =========================
              ITEMS
          ========================= */}

          <h2>Items</h2>

          <div className="order-items">
            {order.items.map(
              (item, index) => (
                <div
                  className="order-item"
                  key={
                    item.product?._id ||
                    item.product ||
                    index
                  }
                >
                  <span>
                    {item.name} ×{" "}
                    {item.quantity}
                  </span>

                  <strong>
                    $
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </strong>
                </div>
              )
            )}
          </div>

          <hr />

          {/* =========================
              SHIPPING INFORMATION
          ========================= */}

          <h2>Shipping Information</h2>

          <div
            style={{
              lineHeight: "1.8",
            }}
          >
            <p>
              <strong>Name:</strong>{" "}
              {order.shippingAddress?.fullName ||
                "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.shippingAddress?.email ||
                "N/A"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.shippingAddress?.phone ||
                "N/A"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.shippingAddress?.street ||
                "N/A"}
              {order.shippingAddress?.city
                ? `, ${order.shippingAddress.city}`
                : ""}
              {order.shippingAddress?.state
                ? `, ${order.shippingAddress.state}`
                : ""}
            </p>
          </div>

          <hr />

          {/* =========================
              PAYMENT + TOTAL
          ========================= */}

          <div className="order-footer">
            <span>
              Payment:{" "}
              {order.paymentMethod}
            </span>

            <strong>
              Total: $
              {Number(
                order.totalPrice
              ).toFixed(2)}
            </strong>
          </div>

          {/* =========================
              BACK BUTTON
          ========================= */}

          <button
            className="cart-btn"
            style={{
              marginTop: "20px",
            }}
            onClick={() =>
              navigate("/orders")
            }
          >
            ← Back to My Orders
          </button>

        </div>

      </section>
    </MainLayout>
  );
}

export default OrderDetails;

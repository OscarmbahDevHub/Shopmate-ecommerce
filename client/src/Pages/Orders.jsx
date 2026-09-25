import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

function Orders({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login to view your orders.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "https://shopmate-ecommerce-a8o8.onrender.com/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.message || "Unable to load orders."
          );
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Fetch Orders Error:", error);

        toast.error(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

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

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="orders-page">

        <div className="section-header">
          <h1>My Orders 📦</h1>

          <p>
            View your recent orders and their status.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              className="cart-btn"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-header">

                  <div>
                    <h2>
                      Order #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </h2>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
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

                <div className="order-items">

                  {order.items.map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={index}
                      >

                        <div>
                          <span>
                            {item.name} ×{" "}
                            {item.quantity}
                          </span>
                        </div>

                        <strong>
                          $
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </strong>

                      </div>
                    )
                  )}

                </div>

                <hr />

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

                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="cart-btn"
                    onClick={() =>
                      navigate(
                        `/orders/${order._id}`
                      )
                    }
                  >
                    View Order
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>
    </MainLayout>
  );
}

export default Orders;
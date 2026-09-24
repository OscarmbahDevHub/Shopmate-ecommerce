import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";
import Loading from "../components/Loading";

function AdminOrders({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ===============================
  // FETCH ADMIN ORDERS
  // ===============================
  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as an admin.");
        navigate("/login");
        return;
      }

      if (!user || user.role !== "admin") {
        toast.error("Access denied. Admins only.");
        navigate("/");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
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

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Admin Orders Error:", error);

      toast.error(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===============================
  // LOAD ORDERS
  // ===============================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ===============================
  // UPDATE ORDER STATUS
  // ===============================
  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            "Unable to update order status."
        );
        return;
      }

      toast.success(
        `Order status changed to ${status}.`
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (error) {
      console.error(
        "Update Status Error:",
        error
      );

      toast.error(
        "Unable to connect to the server."
      );
    }
  };

  // ===============================
  // DASHBOARD STATISTICS
  // ===============================
  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const processingOrders = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const totalRevenue = orders.reduce(
      (total, order) => {
        if (order.status === "Cancelled") {
          return total;
        }

        return (
          total +
          Number(order.totalPrice || 0)
        );
      },
      0
    );

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    };
  }, [orders]);

  // ===============================
  // FILTER ORDERS
  // ===============================
  const filteredOrders = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId =
        order._id?.toLowerCase() || "";

      const customerName =
        order.user?.name?.toLowerCase() || "";

      const customerEmail =
        order.user?.email?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        orderId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        customerEmail.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, statusFilter]);

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ===============================
  // STATUS COLOUR
  // ===============================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          background: "#fff3cd",
          color: "#856404",
        };

      case "Processing":
        return {
          background: "#cfe2ff",
          color: "#084298",
        };

      case "Shipped":
        return {
          background: "#e2d9f3",
          color: "#59359a",
        };

      case "Delivered":
        return {
          background: "#d1e7dd",
          color: "#0f5132",
        };

      case "Cancelled":
        return {
          background: "#f8d7da",
          color: "#842029",
        };

      default:
        return {
          background: "#e9ecef",
          color: "#495057",
        };
    }
  };

  // ===============================
  // STYLES
  // ===============================
  const styles = {
    page: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "30px 20px 60px",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },

    headerTitle: {
      margin: 0,
      fontSize: "32px",
      fontWeight: "700",
    },

    headerText: {
      marginTop: "8px",
      color: "#666",
    },

    refreshButton: {
      border: "none",
      background: "#111827",
      color: "#fff",
      padding: "11px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "18px",
      marginBottom: "30px",
    },

    statCard: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "22px",
      boxShadow:
        "0 4px 14px rgba(0, 0, 0, 0.05)",
    },

    statLabel: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "10px",
    },

    statValue: {
      fontSize: "28px",
      fontWeight: "700",
      margin: 0,
    },

    controls: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "18px",
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "25px",
    },

    searchInput: {
      flex: "1 1 280px",
      minWidth: "220px",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      outline: "none",
    },

    filterSelect: {
      minWidth: "180px",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      fontSize: "15px",
      cursor: "pointer",
    },

    orderList: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    orderCard: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "22px",
      boxShadow:
        "0 4px 14px rgba(0, 0, 0, 0.05)",
    },

    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap",
    },

    orderId: {
      margin: 0,
      fontSize: "20px",
      fontWeight: "700",
    },

    customerInfo: {
      marginTop: "8px",
      color: "#555",
      lineHeight: "1.6",
    },

    total: {
      fontSize: "22px",
      fontWeight: "700",
    },

    items: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    item: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
      padding: "12px",
      background: "#f9fafb",
      borderRadius: "8px",
      flexWrap: "wrap",
    },

    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginTop: "20px",
      paddingTop: "18px",
      borderTop: "1px solid #eee",
    },

    statusSelect: {
      padding: "10px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      cursor: "pointer",
    },

    viewButton: {
      border: "none",
      background: "#2563eb",
      color: "#fff",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    empty: {
      textAlign: "center",
      padding: "70px 20px",
      background: "#fff",
      borderRadius: "14px",
      border: "1px solid #e5e7eb",
    },
  };

  // ===============================
  // PAGE
  // ===============================
  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section style={styles.page}>
        {/* ===============================
            HEADER
        =============================== */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              Admin Dashboard 📊
            </h1>

            <p style={styles.headerText}>
              Manage ShopMate orders and monitor
              your store activity.
            </p>
          </div>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
          >
            {refreshing
              ? "Refreshing..."
              : "🔄 Refresh Orders"}
          </button>
        </div>

        {/* ===============================
            STATISTICS
        =============================== */}
        {!loading && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Total Orders
              </div>

              <p style={styles.statValue}>
                {statistics.totalOrders}
              </p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Pending
              </div>

              <p style={styles.statValue}>
                {statistics.pendingOrders}
              </p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Processing
              </div>

              <p style={styles.statValue}>
                {statistics.processingOrders}
              </p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Delivered
              </div>

              <p style={styles.statValue}>
                {statistics.deliveredOrders}
              </p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Cancelled
              </div>

              <p style={styles.statValue}>
                {statistics.cancelledOrders}
              </p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statLabel}>
                Revenue
              </div>

              <p style={styles.statValue}>
                ${statistics.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* ===============================
            SEARCH + FILTER
        =============================== */}
        {!loading && (
          <div style={styles.controls}>
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={styles.filterSelect}
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        )}

        {/* ===============================
            LOADING
        =============================== */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* ===============================
                RESULTS COUNT
            =============================== */}
            <div
              style={{
                marginBottom: "15px",
                color: "#666",
              }}
            >
              Showing{" "}
              <strong>
                {filteredOrders.length}
              </strong>{" "}
              of{" "}
              <strong>{orders.length}</strong>{" "}
              orders
            </div>

            {/* ===============================
                NO RESULTS
            =============================== */}
            {filteredOrders.length === 0 ? (
              <div style={styles.empty}>
                <h2>
                  {orders.length === 0
                    ? "No orders yet 📦"
                    : "No matching orders"}
                </h2>

                <p>
                  {orders.length === 0
                    ? "Customer orders will appear here when they are placed."
                    : "Try changing your search or status filter."}
                </p>
              </div>
            ) : (
              /* ===============================
                 ORDERS
              =============================== */
              <div style={styles.orderList}>
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    style={styles.orderCard}
                  >
                    {/* ORDER HEADER */}
                    <div style={styles.orderHeader}>
                      <div>
                        <h2 style={styles.orderId}>
                          Order #
                          {order._id
                            ?.slice(-8)
                            .toUpperCase()}
                        </h2>

                        <div
                          style={
                            styles.customerInfo
                          }
                        >
                          <div>
                            <strong>
                              Customer:
                            </strong>{" "}
                            {order.user?.name ||
                              "Unknown customer"}
                          </div>

                          <div>
                            <strong>
                              Email:
                            </strong>{" "}
                            {order.user?.email ||
                              "No email"}
                          </div>

                          <div>
                            <strong>
                              Date:
                            </strong>{" "}
                            {formatDate(
                              order.createdAt
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={styles.total}>
                          $
                          {Number(
                            order.totalPrice || 0
                          ).toFixed(2)}
                        </div>

                        <div
                          style={{
                            marginTop: "8px",
                            display: "inline-block",
                            padding:
                              "6px 10px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                            ...getStatusStyle(
                              order.status
                            ),
                          }}
                        >
                          {order.status ||
                            "Pending"}
                        </div>
                      </div>
                    </div>

                    {/* ORDER ITEMS */}
                    <div style={styles.items}>
                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            style={styles.item}
                          >
                            <span>
                              {item.name} ×{" "}
                              {item.quantity}
                            </span>

                            <strong>
                              $
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toFixed(2)}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    {/* FOOTER */}
                    <div style={styles.footer}>
                      <div>
                        <strong>
                          Payment:
                        </strong>{" "}
                        {order.paymentMethod ||
                          "Not specified"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          style={styles.viewButton}
                          onClick={() =>
                            navigate(
                              `/orders/${order._id}`
                            )
                          }
                        >
                          👁 View Order
                        </button>

                        <select
                          value={
                            order.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                          style={styles.statusSelect}
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}

export default AdminOrders;
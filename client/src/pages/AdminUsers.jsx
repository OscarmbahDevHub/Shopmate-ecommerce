import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";

function AdminUsers({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
          "https://shopmate-ecommerce-a8o8.onrender.com/api/auth/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load users."
          );
        }

        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );
      } catch (error) {
        console.error(
          "Fetch users error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, user]);

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="admin-users-page">
        <div className="admin-users-header">
          <h1>👥 Registered Users</h1>

          <p>
            View users who have created an
            account on ShopMate.
          </p>
        </div>

        {loading ? (
          <div className="admin-users-loading">
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="admin-users-summary">
              <strong>
                Total Users: {users.length}
              </strong>
            </div>

            {users.length === 0 ? (
              <div className="admin-users-empty">
                <h2>No registered users yet.</h2>
                <p>
                  New accounts will appear here
                  automatically.
                </p>
              </div>
            ) : (
              <div className="admin-users-list">
                {users.map((userItem) => (
                  <div
                    key={userItem._id}
                    className="admin-user-card"
                  >
                    <div className="admin-user-card-top">
                      <div>
                        <h2>
                          {userItem.name}
                        </h2>

                        <p>
                          {userItem.email}
                        </p>
                      </div>

                      <span
                        className={`admin-user-role ${
                          userItem.role === "admin"
                            ? "admin"
                            : "user"
                        }`}
                      >
                        {userItem.role}
                      </span>
                    </div>

                    <div className="admin-user-details">
                      <p>
                        <strong>
                          Registered:
                        </strong>{" "}
                        {userItem.createdAt
                          ? new Date(
                              userItem.createdAt
                            ).toLocaleString()
                          : "Unknown"}
                      </p>

                      <p>
                        <strong>
                          Last Login:
                        </strong>{" "}
                        {userItem.lastLogin
                          ? new Date(
                              userItem.lastLogin
                            ).toLocaleString()
                          : "Never"}
                      </p>
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

export default AdminUsers;
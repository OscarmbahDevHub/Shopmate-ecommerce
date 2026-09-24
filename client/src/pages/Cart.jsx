import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";

function Cart({
  cart,
  cartCount,
  searchTerm,
  setSearchTerm,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please login before proceeding to checkout.");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="cart-page">
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1>🛒 Shopping Cart</h1>

            {cart.length > 0 && (
              <p
                style={{
                  color: "#666",
                  marginTop: "8px",
                }}
              >
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            )}
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => navigate("/products")}
              style={{
                background: "transparent",
                border: "1px solid #2563eb",
                color: "#2563eb",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ← Continue Shopping
            </button>
          )}
        </div>

        {/* EMPTY CART */}

        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>
              Looks like you haven't added anything yet.
              Start shopping and add something you love.
            </p>

            <button
              type="button"
              className="cart-btn"
              onClick={() => navigate("/products")}
            >
              🛍 Start Shopping
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "35px",
              alignItems: "start",
            }}
          >
            {/* CART ITEMS */}

            <div>
              {cart.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "20px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "14px",
                    background: "#fff",
                  }}
                >
                  {/* PRODUCT IMAGE */}

                  <img
                    src={product.image}
                    alt={product.name}
                    width="110"
                    height="110"
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  {/* PRODUCT DETAILS */}

                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      {product.name}
                    </h3>

                    <p
                      style={{
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                    >
                      ${Number(product.price).toFixed(2)}
                    </p>

                    {/* QUANTITY */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "15px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(product.id)
                        }
                        aria-label={`Decrease quantity of ${product.name}`}
                        style={{
                          width: "34px",
                          height: "34px",
                          border: "1px solid #ddd",
                          background: "#f8f8f8",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ➖
                      </button>

                      <strong
                        style={{
                          minWidth: "25px",
                          textAlign: "center",
                        }}
                      >
                        {product.quantity}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(product.id)
                        }
                        aria-label={`Increase quantity of ${product.name}`}
                        style={{
                          width: "34px",
                          height: "34px",
                          border: "1px solid #ddd",
                          background: "#f8f8f8",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ➕
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL + REMOVE */}

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "15px",
                      }}
                    >
                      $
                      {(
                        Number(product.price) *
                        product.quantity
                      ).toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(product.id)
                      }
                      style={{
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "9px 14px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}

            <aside
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "25px",
                background: "#fff",
                position: "sticky",
                top: "20px",
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Items</span>
                <strong>{totalItems}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Subtotal</span>

                <strong>
                  ${totalPrice.toFixed(2)}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Shipping</span>

                <span
                  style={{
                    color: "#16a34a",
                    fontWeight: "600",
                  }}
                >
                  FREE
                </span>
              </div>

              <hr
                style={{
                  margin: "20px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                  marginBottom: "25px",
                }}
              >
                <strong>Total</strong>

                <strong
                  style={{
                    color: "#2563eb",
                  }}
                >
                  ${totalPrice.toFixed(2)}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "14px 20px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                🛍 Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Cart;
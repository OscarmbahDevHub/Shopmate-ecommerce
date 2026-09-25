import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../Layouts/MainLayout";

function Checkout({
  cart,
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidMongoId = (value) => {
    if (typeof value !== "string" && typeof value !== "number") {
      return false;
    }

    return /^[a-fA-F0-9]{24}$/.test(String(value).trim());
  };

  const normalizeProductId = (value) => {
    if (!value) return null;

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      const id = String(value).trim();
      return isValidMongoId(id) ? id : null;
    }

    if (typeof value === "object" && value !== null) {
      const values = [
        value._id,
        value.id,
        value.productId,
        value.$oid,
      ];

      for (const nestedValue of values) {
        const id = normalizeProductId(nestedValue);

        if (id) return id;
      }
    }

    return null;
  };

  const getProductId = (item) => {
    if (!item || typeof item !== "object") {
      return null;
    }

    const possibleIds = [
      item._id,
      item.id,
      item.productId,
      item.product,
      item.product?._id,
      item.product?.id,
      item.product?.productId,
      item.product?.$oid,
      item._id?.$oid,
      item.productId?.$oid,
    ];

    for (const value of possibleIds) {
      const id = normalizeProductId(value);

      if (id) return id;
    }

    return null;
  };

  const getProductName = (item) => {
    return (
      item?.name ||
      item?.product?.name ||
      ""
    )
      .toString()
      .trim();
  };

  const loadProducts = async () => {
    const response = await fetch(
      "https://shopmate-ecommerce-a8o8.onrender.com/api/products"
    );

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load products."
      );
    }

    if (!Array.isArray(data.products)) {
      throw new Error(
        "The product API returned an invalid response."
      );
    }

    return data.products;
  };

  const resolveCartItems = async () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const products = await loadProducts();
    const resolvedItems = [];

    for (const item of cart) {
      const cartName = getProductName(item);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(
          `Invalid quantity for "${cartName || "a product"}".`
        );
      }

      const existingProductId = getProductId(item);

      let matchingProduct = null;

      if (existingProductId) {
        matchingProduct = products.find((product) => {
          const productId = normalizeProductId(
            product._id || product.id
          );

          return productId === existingProductId;
        });
      }

      if (!matchingProduct) {
        matchingProduct = products.find((product) => {
          const productName = String(product.name || "")
            .trim()
            .toLowerCase();

          return (
            cartName.toLowerCase() === productName
          );
        });
      }

      if (!matchingProduct) {
        throw new Error(
          `Could not identify "${cartName || "one of your products"}". Please remove it from your cart and add it again.`
        );
      }

      const realProductId = normalizeProductId(
        matchingProduct._id || matchingProduct.id
      );

      if (!realProductId) {
        throw new Error(
          `The product "${cartName}" does not have a valid database ID.`
        );
      }

      resolvedItems.push({
        product: realProductId,
        quantity,
      });
    }

    return resolvedItems;
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const createOrder = async (token, method) => {
    const orderItems = await resolveCartItems();

    const response = await fetch(
      "https://shopmate-ecommerce-a8o8.onrender.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,

          shippingAddress: {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
          },

          paymentMethod: method,
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
      throw new Error(
        data.message || "Unable to create your order."
      );
    }

    return data;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!user) {
      toast.error(
        "Please login before placing an order."
      );

      navigate("/login");
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/products");
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !paymentMethod
    ) {
      toast.error(
        "Please complete all shipping information."
      );

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        "Your login session has expired."
      );

      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // PAYSTACK — DEMO ONLY
      // ==========================================

      if (paymentMethod === "Paystack") {
        toast.info(
          "Paystack is available as a demo option for this portfolio project. No payment will be processed."
        );

        setLoading(false);
        return;
      }

      // ==========================================
      // PAYPAL — DEMO ORDER
      // ==========================================

      if (paymentMethod === "PayPal") {
        const orderData = await createOrder(
          token,
          "PayPal"
        );

        toast.success(
          "🎉 PayPal demo order created successfully."
        );

        localStorage.removeItem("cart");

        navigate("/order-success", {
          state: {
            order: orderData.order,
          },
        });

        return;
      }

      // ==========================================
      // BANK TRANSFER — REAL ORDER CREATION
      // ==========================================

      if (paymentMethod === "Bank Transfer") {
        const orderData = await createOrder(
          token,
          "Bank Transfer"
        );

        toast.success(
          "🎉 Order placed successfully!"
        );

        toast.info(
          "Your order is awaiting bank transfer payment."
        );

        localStorage.removeItem("cart");

        navigate("/order-success", {
          state: {
            order: orderData.order,
          },
        });

        return;
      }

      toast.error(
        "Please select a valid payment method."
      );
    } catch (error) {
      console.error(
        "❌ Checkout Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to complete checkout."
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
      <section className="checkout-page">
        <div className="section-header">
          <h1>Secure Checkout 🔒</h1>

          <p>
            Choose your preferred payment method
            to complete your order.
          </p>
        </div>

        <form
          className="checkout-container"
          onSubmit={handlePlaceOrder}
        >
          <div className="checkout-form">
            <h2>Shipping Information</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              disabled={loading}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              disabled={loading}
              required
            />

            <input
              type="text"
              placeholder="Street Address"
              value={street}
              onChange={(e) =>
                setStreet(e.target.value)
              }
              disabled={loading}
              required
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              disabled={loading}
              required
            />

            <input
              type="text"
              placeholder="State / Region"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
              disabled={loading}
              required
            />

            <h2 className="payment-heading">
              Payment Method
            </h2>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              disabled={loading}
              required
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="Paystack">
                💳 Paystack
              </option>

              <option value="PayPal">
                🅿️ PayPal
              </option>

              <option value="Bank Transfer">
                🏦 Bank Transfer
              </option>
            </select>

            {paymentMethod === "Paystack" && (
              <p className="payment-note">
                Paystack is included as a demo
                payment option for this portfolio
                project. No payment will be processed.
              </p>
            )}

            {paymentMethod === "PayPal" && (
              <p className="payment-note">
                PayPal is currently in demo mode
                for this portfolio project.
              </p>
            )}

            {paymentMethod === "Bank Transfer" && (
              <p className="payment-note">
                Your order will be created and
                marked as pending payment.
              </p>
            )}
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cart.map((item, index) => (
              <div
                key={
                  getProductId(item) ||
                  `${getProductName(item)}-${index}`
                }
                className="checkout-item"
              >
                <span>
                  {getProductName(item) ||
                    "Product"}{" "}
                  × {item.quantity}
                </span>

                <strong>
                  $
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}

            <hr />

            <h2>
              Total: ${total.toFixed(2)}
            </h2>

            <button
              type="submit"
              className="cart-btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "Paystack"
                ? "💳 Paystack Demo"
                : paymentMethod === "PayPal"
                ? "🅿️ Continue with PayPal"
                : paymentMethod === "Bank Transfer"
                ? "🏦 Place Order"
                : "🛒 Select Payment Method"}
            </button>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}

export default Checkout;

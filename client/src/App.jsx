import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Deals from "./pages/Deals";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./Pages/Contact";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";

function App() {
  // ===============================
  // CART
  // ===============================
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ===============================
  // WISHLIST
  // ===============================
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // ===============================
  // SEARCH / CATEGORY
  // ===============================
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ===============================
  // USER
  // ===============================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ===============================
  // ADD TO CART
  // ===============================
  const addToCart = (product) => {
    const productId = product._id || product.id;

    const existingProduct = cart.find(
      (item) => (item._id || item.id) === productId
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );

      toast.success(
        `🛒 ${product.name} quantity updated!`
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          _id: product._id || product.id,
          quantity: 1,
        },
      ]);

      toast.success(
        `🛒 ${product.name} added to cart!`
      );
    }
  };

  // ===============================
  // REMOVE FROM CART
  // ===============================
  const removeFromCart = (productId) => {
    setCart(
      cart.filter(
        (item) =>
          (item._id || item.id) !== productId
      )
    );
  };

  // ===============================
  // INCREASE QUANTITY
  // ===============================
  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // ===============================
  // DECREASE QUANTITY
  // ===============================
  const decreaseQuantity = (productId) => {
    setCart(
      cart
        .map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ===============================
  // WISHLIST
  // ===============================
  const toggleWishlist = (product) => {
    const productId = product._id || product.id;

    const exists = wishlist.find(
      (item) =>
        (item._id || item.id) === productId
    );

    if (exists) {
      setWishlist(
        wishlist.filter(
          (item) =>
            (item._id || item.id) !== productId
        )
      );

      toast.info(
        `💔 ${product.name} removed from wishlist`
      );
    } else {
      setWishlist([
        ...wishlist,
        product,
      ]);

      toast.success(
        `❤️ ${product.name} added to wishlist`
      );
    }
  };

  // ===============================
  // CART COUNT
  // ===============================
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // ===============================
  // SAVE CART
  // ===============================
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // ===============================
  // SAVE WISHLIST
  // ===============================
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // ===============================
  // SAVE USER
  // ===============================
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              cartCount={cartCount}
              addToCart={addToCart}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* SHOP */}
        <Route
          path="/products"
          element={
            <Shop
              cartCount={cartCount}
              addToCart={addToCart}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              cartCount={cartCount}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cartCount={cartCount}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <Register
              user={user}
              setUser={setUser}
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ORDER SUCCESS */}
        <Route
          path="/order-success"
          element={
            <OrderSuccess
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* DEALS */}
        <Route
          path="/deals"
          element={
            <Deals
              cartCount={cartCount}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* CATEGORIES */}
        <Route
          path="/categories"
          element={
            <Categories
              cartCount={cartCount}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <About
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <Contact
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <Orders
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <AdminOrders
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        {/* ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <AdminProducts
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
           path="/admin/users"
           element={<AdminUsers 
           cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
          />
        }
        />

        {/* ORDER DETAILS */}
        <Route
          path="/orders/:id"
          element={
            <OrderDetails
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </ErrorBoundary>
  );
}

export default App;
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Shop from "./Pages/Shop";
import Wishlist from "./Pages/Wishlist";
import ProductDetails from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import Deals from "./Pages/Deals";
import Categories from "./Pages/Categories";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Orders from "./Pages/Orders";
import AdminOrders from "./Pages/AdminOrders";
import OrderDetails from "./Pages/OrderDetails";
import AdminProducts from "./Pages/AdminProducts";
import AdminUsers from "./Pages/AdminUsers";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

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

      toast.success(`${product.name} quantity updated!`);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          _id: product._id || product.id,
          quantity: 1,
        },
      ]);

      toast.success(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = (productId) => {
    setCart(
      cart.filter(
        (item) => (item._id || item.id) !== productId
      )
    );
  };

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

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;

    const exists = wishlist.find(
      (item) => (item._id || item.id) === productId
    );

    if (exists) {
      setWishlist(
        wishlist.filter(
          (item) => (item._id || item.id) !== productId
        )
      );

      toast.info(`${product.name} removed from wishlist`);
    } else {
      setWishlist([...wishlist, product]);

      toast.success(`${product.name} added to wishlist`);
    }
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <Routes>
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
          element={
            <AdminUsers
              cartCount={cartCount}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
              setUser={setUser}
            />
          }
        />

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
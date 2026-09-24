import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import { getProducts } from "../services/productService";

function Shop({
  cartCount,
  addToCart,
  wishlist,
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const checkBackendProducts = async () => {
      try {
        const backendProducts = await getProducts();

        console.log(
          "✅ MongoDB products available:",
          backendProducts.length
        );
      } catch (error) {
        console.error(
          "⚠️ Could not load MongoDB products:",
          error
        );
      }
    };

    checkBackendProducts();
  }, []);

  let filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (sortBy === "low-high") {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortBy === "high-low") {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }

  if (sortBy === "rating") {
    filteredProducts.sort(
      (a, b) => b.rating - a.rating
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
      <section className="shop-banner">
        <h1>Premium Collection</h1>

        <p>
          Explore our complete collection of premium products
          carefully selected for quality and performance.
        </p>
      </section>

      <section className="shop-header">
        <div>
          <h2>All Products</h2>

          <p>
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div className="shop-sort">
          <label>Sort By:</label>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="default">
              Featured
            </option>

            <option value="low-high">
              Price: Low to High
            </option>

            <option value="high-low">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>
          </select>
        </div>
      </section>

      <section className="shop-products">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              🔍
            </div>

            <h2>No products found</h2>

            <p>
              We couldn't find any products matching{" "}
              {searchTerm
                ? `"${searchTerm}"`
                : "your search"}.
            </p>

            {searchTerm && (
              <button
                type="button"
                className="cart-btn"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default Shop;
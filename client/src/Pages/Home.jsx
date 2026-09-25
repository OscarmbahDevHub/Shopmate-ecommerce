import MainLayout from "../layouts/MainLayout";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import products from "../data/products";

function Home({
  cartCount,
  addToCart,
  wishlist,
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  user,
  setUser,
}) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <HeroSlider />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FeaturedProducts
        addToCart={addToCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />

      <section className="featured-products">
        <div className="section-header">
          <h2>Featured Products</h2>

          <p>
            Browse our premium collection of carefully selected products.
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>

            <h2>No products found</h2>

            <p>
              We couldn't find any products matching your current
              search or category.
            </p>

            {(searchTerm || selectedCategory !== "All") && (
              <button
                type="button"
                className="cart-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
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

export default Home;
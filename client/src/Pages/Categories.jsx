import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Categories({
  cartCount,
  addToCart,
  wishlist,
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="categories-page">
        <div className="section-header">
          <h1>Shop by Category</h1>

          <p>Choose a category to explore our products.</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category
            );

            return (
              <div
                key={category}
                className="category-card"
                onClick={() => {
                  const section = document.getElementById(category);

                  if (section) {
                    section.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <h2>{category}</h2>

                <p>
                  {categoryProducts.length}{" "}
                  {categoryProducts.length === 1
                    ? "Product"
                    : "Products"}
                </p>
              </div>
            );
          })}
        </div>

        {categories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.category === category
          );

          return (
            <section
              key={category}
              id={category}
              className="category-section"
            >
              <h2>{category}</h2>

              {categoryProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📦</div>

                  <h2>No products available</h2>

                  <p>
                    There are currently no products in this
                    category.
                  </p>
                </div>
              ) : (
                <div className="products-grid">
                  {categoryProducts.map((product) => (
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
          );
        })}
      </section>
    </MainLayout>
  );
}

export default Categories;
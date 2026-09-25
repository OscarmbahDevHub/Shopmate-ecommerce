import MainLayout from "../Layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Deals({
  cartCount,
  addToCart,
  wishlist = [],
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const dealProducts = products.filter(
    (product) => (product.discount || 0) > 0
  );

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="shop-banner">
        <h1>🔥 Hot Deals</h1>

        <p>
          Grab today's biggest discounts before they're gone.
        </p>
      </section>

      <section className="shop-header">
        <div>
          <h2>Today's Deals</h2>

          <p>{dealProducts.length} products on sale</p>
        </div>
      </section>

      <section className="shop-products">
        {dealProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔥</div>

            <h2>No deals available right now</h2>

            <p>
              There are currently no discounted products available.
              Check back later for new deals.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {dealProducts.map((product) => (
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

export default Deals;

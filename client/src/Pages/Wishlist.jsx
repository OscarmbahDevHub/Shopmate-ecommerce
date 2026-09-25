import MainLayout from "../Layouts/MainLayout";
import ProductCard from "../components/ProductCard";

function Wishlist({
  wishlist,
  cartCount,
  addToCart,
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="wishlist-page">
        <div className="section-header">
          <h1>❤️ My Wishlist</h1>

          <p>
            Save your favourite products and buy them later.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>

            <h2>Your wishlist is empty</h2>

            <p>
              You haven't saved any products yet. Click the ❤️
              button on any product to add it to your wishlist.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map((product) => (
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

export default Wishlist;

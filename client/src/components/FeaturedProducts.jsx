import products from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts({
  addToCart,
  wishlist,
  toggleWishlist,
}) {
  const featuredProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <section className="featured-slider">
      <div className="section-header">
        <h2>⭐ Featured Products</h2>
        <p>Hand-picked products our customers love.</p>
      </div>

      <div className="products-grid">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
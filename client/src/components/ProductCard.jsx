import { Link } from "react-router-dom";

function ProductCard({
  product,
  addToCart,
  wishlist = [],
  toggleWishlist,
}) {
  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  const hasDiscount = Number(product.discount) > 0;

  const price = Number(product.price) || 0;

  const oldPrice = hasDiscount
    ? price / (1 - Number(product.discount) / 100)
    : null;

  const stock = Number(product.stock || 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isInStock = stock > 5;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    if (addToCart) {
      addToCart(product);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (toggleWishlist) {
      toggleWishlist(product);
    }
  };

  const handleImageError = (e) => {
    e.currentTarget.src =
      "https://placehold.co/600x400?text=Product+Image";
  };

  return (
    <div className="product-card">
      {/* DISCOUNT */}

      {hasDiscount && (
        <span className="discount-badge">
          -{product.discount}%
        </span>
      )}

      {/* WISHLIST */}

      <button
        type="button"
        className="wishlist-btn"
        aria-label={
          isWishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        onClick={handleWishlist}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* PRODUCT */}

      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />

        <div className="product-info">
          <span className="product-category">
            {product.category}
          </span>

          <h3>{product.name}</h3>

          {/* RATING */}

          <div className="rating">
            ⭐ {product.rating}

            <span>
              ({product.reviews || 120} reviews)
            </span>
          </div>

          {/* PRICE */}

          <div className="price">
            <span className="new-price">
              ${price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span className="old-price">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* STOCK STATUS */}

          <div
            className={`stock-status ${
              isOutOfStock
                ? "out-of-stock"
                : isLowStock
                ? "low-stock"
                : "in-stock"
            }`}
          >
            {isOutOfStock && <>❌ Out of Stock</>}

            {isLowStock && (
              <>
                ⚠️ Only {stock}{" "}
                {stock === 1 ? "unit" : "units"} left
              </>
            )}

            {isInStock && <>✅ In Stock</>}
          </div>
        </div>
      </Link>

      {/* ADD TO CART */}

      <button
        type="button"
        className="cart-btn"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        style={{
          opacity: isOutOfStock ? 0.6 : 1,
          cursor: isOutOfStock
            ? "not-allowed"
            : "pointer",
        }}
      >
        {isOutOfStock
          ? "❌ Out of Stock"
          : "🛒 Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
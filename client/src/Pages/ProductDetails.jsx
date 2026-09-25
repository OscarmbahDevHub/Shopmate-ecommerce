import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function ProductDetails({
  cartCount,
  addToCart,
  wishlist,
  toggleWishlist,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [reviews, setReviews] = useState(() => {
    if (!product) return [];

    const saved = localStorage.getItem(
      `reviews-${product.id}`
    );

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!product) return;

    localStorage.setItem(
      `reviews-${product.id}`,
      JSON.stringify(reviews)
    );
  }, [reviews, product]);

  if (!product) {
    return (
      <MainLayout
        cartCount={cartCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        setUser={setUser}
      >
        <section
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2>Product not found.</h2>

          <p>
            The product you're looking for doesn't exist.
          </p>
        </section>
      </MainLayout>
    );
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  const mainImage = product.image;

  const stock = Number(product.stock || 0);

  // ===============================
  // STOCK STATUS
  // ===============================

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isInStock = stock > 5;

  const handleSubmitReview = () => {
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      setReviewError(
        "Please enter your name and review."
      );
      return;
    }

    const newReview = {
      id: Date.now(),
      name: trimmedName,
      rating,
      comment: trimmedComment,
    };

    setReviews((currentReviews) => [
      newReview,
      ...currentReviews,
    ]);

    setName("");
    setRating(5);
    setComment("");
    setReviewError("");
  };

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px",
          alignItems: "center",
          padding: "40px 0",
        }}
      >
        {/* ===============================
            PRODUCT IMAGE
        =============================== */}

        <div
          style={{
            overflow: "hidden",
            borderRadius: "20px",
            maxWidth: "500px",
          }}
        >
          <img
            src={mainImage}
            alt={product.name}
            className="product-detail-image"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>

        {/* ===============================
            PRODUCT INFORMATION
        =============================== */}

        <div>
          <span
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div
            style={{
              margin: "15px 0",
              fontSize: "18px",
            }}
          >
            ⭐ {product.rating}

            <span
              style={{
                color: "#666",
              }}
            >
              {" "}
              ({product.reviews || 120} reviews)
            </span>
          </div>

          <h2
            style={{
              color: "#2563eb",
            }}
          >
            ${Number(product.price).toFixed(2)}
          </h2>

          {/* ===============================
              STOCK STATUS
          =============================== */}

          <div
            style={{
              margin: "20px 0",
            }}
          >
            {isOutOfStock && (
              <p
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                ❌ Out of Stock
              </p>
            )}

            {isLowStock && (
              <p
                style={{
                  color: "#ea580c",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                ⚠️ Low Stock — Only {stock}{" "}
                {stock === 1 ? "unit" : "units"} left
              </p>
            )}

            {isInStock && (
              <p
                style={{
                  color: "#16a34a",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                ✅ In Stock — {stock} available
              </p>
            )}
          </div>

          <p
            style={{
              lineHeight: "1.8",
            }}
          >
            {product.description ||
              "Premium quality product carefully selected by ShopMate."}
          </p>

          {/* ===============================
              ADD TO CART
          =============================== */}

          <button
            className="cart-btn"
            onClick={() => addToCart(product)}
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

          {/* ===============================
              REVIEWS
          =============================== */}

          <div className="reviews-section">
            <h2>Customer Reviews</h2>

            <div className="review-form">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setReviewError("");
                }}
              />

              <select
                value={rating}
                onChange={(e) =>
                  setRating(
                    Number(e.target.value)
                  )
                }
              >
                <option value={5}>
                  ⭐⭐⭐⭐⭐ (5)
                </option>

                <option value={4}>
                  ⭐⭐⭐⭐ (4)
                </option>

                <option value={3}>
                  ⭐⭐⭐ (3)
                </option>

                <option value={2}>
                  ⭐⭐ (2)
                </option>

                <option value={1}>
                  ⭐ (1)
                </option>
              </select>

              <textarea
                rows="4"
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setReviewError("");
                }}
              />

              {reviewError && (
                <p
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {reviewError}
                </p>
              )}

              <button
                type="button"
                className="cart-btn"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>
            </div>

            {reviews.length === 0 && (
              <p
                style={{
                  color: "#666",
                  marginTop: "20px",
                }}
              >
                No reviews yet. Be the first to
                review this product!
              </p>
            )}

            {reviews.map((review) => (
              <div
                key={review.id}
                className="review-card"
              >
                <h4>
                  {"⭐".repeat(review.rating)}{" "}
                  {review.name}
                </h4>

                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===============================
          RELATED PRODUCTS
      =============================== */}

      <section
        style={{
          marginTop: "80px",
        }}
      >
        <div className="section-header">
          <h2>You May Also Like</h2>

          <p>
            Similar products you might love.
          </p>
        </div>

        <div className="products-grid">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default ProductDetails;
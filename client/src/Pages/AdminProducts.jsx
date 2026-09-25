import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../Layouts/MainLayout";
import Loading from "../components/Loading";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  image: "",
  category: "",
  brand: "",
  stock: "",
  rating: "",
  numReviews: "",
  isFeatured: false,
};

function AdminProducts({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // ===============================
  // AUTH CHECK
  // ===============================
  const checkAdmin = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login as an admin.");
      navigate("/login");
      return false;
    }

    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admins only.");
      navigate("/");
      return false;
    }

    return true;
  };

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      if (!checkAdmin()) {
        return;
      }

      const response = await fetch(
        "https://shopmate-ecommerce-a8o8.onrender.com/api/products/",
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            "Unable to load products.",
        );
        return;
      }

      // Backend returns { success, count, products }
      // so pull the array out of data.products, not data itself.
      setProducts(
        Array.isArray(data.products)
          ? data.products
          : [],
      );
    } catch (error) {
      console.error(
        "Admin Products Error:",
        error,
      );

      toast.error(
        "Unable to connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===============================
  // FORM INPUT
  // ===============================
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===============================
  // OPEN ADD FORM
  // ===============================
  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================
  const openEditForm = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      discountPrice:
        product.discountPrice ?? "",
      image: product.image || "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock ?? "",
      rating: product.rating ?? "",
      numReviews:
        product.numReviews ?? "",
      isFeatured:
        product.isFeatured || false,
    });

    setShowForm(true);
  };

  // ===============================
  // CLOSE FORM
  // ===============================
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  // ===============================
  // SAVE PRODUCT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkAdmin()) {
      return;
    }

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.image.trim() ||
      !form.category.trim() ||
      form.price === ""
    ) {
      toast.error(
        "Please complete all required product fields.",
      );
      return;
    }

    const price = Number(form.price);

    const discountPrice =
      form.discountPrice === ""
        ? null
        : Number(form.discountPrice);

    const stock =
      form.stock === ""
        ? 0
        : Number(form.stock);

    const rating =
      form.rating === ""
        ? 0
        : Number(form.rating);

    const numReviews =
      form.numReviews === ""
        ? 0
        : Number(form.numReviews);

    if (Number.isNaN(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (
      discountPrice !== null &&
      (Number.isNaN(discountPrice) ||
        discountPrice < 0)
    ) {
      toast.error(
        "Please enter a valid discount price.",
      );
      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      toast.error(
        "Please enter a valid stock quantity.",
      );
      return;
    }

    if (
      Number.isNaN(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      toast.error(
        "Rating must be between 0 and 5.",
      );
      return;
    }

    if (
      Number.isNaN(numReviews) ||
      numReviews < 0
    ) {
      toast.error(
        "Number of reviews cannot be negative.",
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const productData = {
        name: form.name.trim(),
        description:
          form.description.trim(),
        price,
        discountPrice,
        image: form.image.trim(),
        category: form.category.trim(),
        brand: form.brand.trim(),
        stock,
        rating,
        numReviews,
        isFeatured: form.isFeatured,
      };

      const url = editingProduct
  ? `https://shopmate-ecommerce-a8o8.onrender.com/api/products/${editingProduct._id}`
  : "https://shopmate-ecommerce-a8o8.onrender.com/api/products/";
      const method = editingProduct
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            "Unable to save product.",
        );
        return;
      }

      if (editingProduct) {
        setProducts((current) =>
          current.map((product) =>
            product._id ===
            editingProduct._id
              ? data.product
              : product,
          ),
        );

        toast.success(
          "Product updated successfully!",
        );
      } else {
        setProducts((current) => [
          data.product,
          ...current,
        ]);

        toast.success(
          "Product created successfully!",
        );
      }

      closeForm();
    } catch (error) {
      console.error(
        "Save Product Error:",
        error,
      );

      toast.error(
        "Unable to connect to the server.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // DELETE PRODUCT
  // ===============================
  const deleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this product?",
    );

    if (!confirmed) {
      return;
    }

    if (!checkAdmin()) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `https://shopmate-ecommerce-a8o8.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.message ||
            "Unable to delete product.",
        );
        return;
      }

      setProducts((current) =>
        current.filter(
          (product) =>
            product._id !== productId,
        ),
      );

      toast.success(
        "Product removed successfully!",
      );
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error,
      );

      toast.error(
        "Unable to connect to the server.",
      );
    }
  };

  // ===============================
  // CATEGORIES
  // ===============================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean),
      ),
    ];

    return uniqueCategories.sort();
  }, [products]);

  // ===============================
  // FILTER PRODUCTS
  // ===============================
  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const brand =
        product.brand?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        category.includes(searchValue) ||
        brand.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    categoryFilter,
  ]);

  // ===============================
  // STYLES
  // ===============================
  const styles = {
    page: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "30px 20px 60px",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
      marginBottom: "25px",
    },

    title: {
      margin: 0,
      fontSize: "32px",
      fontWeight: "700",
    },

    subtitle: {
      marginTop: "8px",
      color: "#666",
    },

    addButton: {
      border: "none",
      background: "#2563eb",
      color: "#fff",
      padding: "12px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
    },

    controls: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "18px",
      marginBottom: "25px",
    },

    input: {
      flex: "1 1 280px",
      minWidth: "220px",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box",
    },

    select: {
      minWidth: "180px",
      padding: "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      fontSize: "15px",
      cursor: "pointer",
    },

    count: {
      color: "#666",
      marginBottom: "15px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },

    card: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow:
        "0 4px 14px rgba(0,0,0,0.05)",
    },

    image: {
      width: "100%",
      height: "210px",
      objectFit: "cover",
      background: "#f3f4f6",
      display: "block",
    },

    cardBody: {
      padding: "18px",
    },

    category: {
      color: "#6b7280",
      fontSize: "13px",
      marginBottom: "6px",
    },

    productName: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "700",
    },

    brand: {
      color: "#666",
      marginTop: "5px",
      fontSize: "14px",
    },

    price: {
      marginTop: "12px",
      fontSize: "20px",
      fontWeight: "700",
    },

    stock: {
      marginTop: "8px",
      fontSize: "14px",
    },

    actions: {
      display: "flex",
      gap: "10px",
      marginTop: "16px",
    },

    editButton: {
      flex: 1,
      border: "none",
      background: "#111827",
      color: "#fff",
      padding: "10px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },

    deleteButton: {
      flex: 1,
      border: "none",
      background: "#dc2626",
      color: "#fff",
      padding: "10px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },

    empty: {
      textAlign: "center",
      padding: "70px 20px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
    },

    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9999,
      overflowY: "auto",
    },

    modal: {
      width: "100%",
      maxWidth: "700px",
      background: "#fff",
      borderRadius: "16px",
      padding: "25px",
      boxSizing: "border-box",
      margin: "30px 0",
    },

    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      marginBottom: "20px",
    },

    closeButton: {
      border: "none",
      background: "#f3f4f6",
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      cursor: "pointer",
      fontSize: "18px",
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "15px",
    },

    field: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    fullField: {
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },

    label: {
      fontWeight: "600",
      fontSize: "14px",
    },

    textarea: {
      width: "100%",
      minHeight: "110px",
      resize: "vertical",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      fontFamily: "inherit",
    },

    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "5px",
    },

    formActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "25px",
      flexWrap: "wrap",
    },

    cancelButton: {
      border: "1px solid #d1d5db",
      background: "#fff",
      color: "#111827",
      padding: "11px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    saveButton: {
      border: "none",
      background: "#2563eb",
      color: "#fff",
      padding: "11px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section style={styles.page}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Product Management 🛍️
            </h1>

            <p style={styles.subtitle}>
              Add, edit, search and manage
              ShopMate products.
            </p>
          </div>

          <button
            type="button"
            style={styles.addButton}
            onClick={openAddForm}
          >
            ➕ Add Product
          </button>
        </div>

        {/* SEARCH / FILTER */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search products, brands or categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.input}
          />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div style={styles.count}>
              Showing{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              of{" "}
              <strong>
                {products.length}
              </strong>{" "}
              products
            </div>

            {/* EMPTY */}
            {filteredProducts.length === 0 ? (
              <div style={styles.empty}>
                <h2>
                  {products.length === 0
                    ? "No products found 📦"
                    : "No matching products"}
                </h2>

                <p>
                  {products.length === 0
                    ? "Add your first product using the button above."
                    : "Try another search or category."}
                </p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredProducts.map(
                  (product) => (
                    <div
                      key={product._id}
                      style={styles.card}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.image}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <div style={styles.cardBody}>
                        <div
                          style={styles.category}
                        >
                          {product.category}
                        </div>

                        <h2
                          style={
                            styles.productName
                          }
                        >
                          {product.name}
                        </h2>

                        {product.brand && (
                          <div
                            style={styles.brand}
                          >
                            Brand:{" "}
                            {product.brand}
                          </div>
                        )}

                        <div
                          style={styles.price}
                        >
                          $
                          {Number(
                            product.price || 0
                          ).toFixed(2)}
                        </div>

                        {product.discountPrice !==
                          null &&
                          product.discountPrice !==
                            undefined &&
                          Number(
                            product.discountPrice
                          ) > 0 && (
                            <div
                              style={{
                                color:
                                  "#16a34a",
                                fontSize:
                                  "14px",
                                marginTop:
                                  "4px",
                              }}
                            >
                              Discount: $
                              {Number(
                                product.discountPrice
                              ).toFixed(2)}
                            </div>
                          )}

                        <div
                          style={{
                            ...styles.stock,
                            color:
                              Number(
                                product.stock
                              ) <= 0
                                ? "#dc2626"
                                : Number(
                                      product.stock
                                    ) <= 5
                                  ? "#d97706"
                                  : "#16a34a",
                          }}
                        >
                          Stock:{" "}
                          {product.stock ?? 0}
                        </div>

                        <div
                          style={{
                            marginTop: "6px",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          ⭐{" "}
                          {Number(
                            product.rating || 0
                          ).toFixed(1)}{" "}
                          (
                          {product.numReviews ||
                            0}{" "}
                          reviews)
                        </div>

                        {product.isFeatured && (
                          <div
                            style={{
                              marginTop: "10px",
                              display:
                                "inline-block",
                              background:
                                "#fef3c7",
                              color: "#92400e",
                              padding:
                                "5px 9px",
                              borderRadius:
                                "20px",
                              fontSize:
                                "12px",
                              fontWeight:
                                "600",
                            }}
                          >
                            ⭐ Featured
                          </div>
                        )}

                        <div
                          style={styles.actions}
                        >
                          <button
                            type="button"
                            style={
                              styles.editButton
                            }
                            onClick={() =>
                              openEditForm(
                                product,
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            style={
                              styles.deleteButton
                            }
                            onClick={() =>
                              deleteProduct(
                                product._id,
                              )
                            }
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </>
        )}

        {/* PRODUCT FORM MODAL */}
        {showForm && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <div>
                  <h2 style={{ margin: 0 }}>
                    {editingProduct
                      ? "Edit Product"
                      : "Add New Product"}
                  </h2>

                  <p
                    style={{
                      marginTop: "6px",
                      color: "#666",
                    }}
                  >
                    {editingProduct
                      ? "Update this product's information."
                      : "Add a new product to ShopMate."}
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.closeButton}
                  onClick={closeForm}
                  disabled={saving}
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
              >
                <div style={styles.formGrid}>
                  {/* NAME */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Product Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Sony WH-1000XM5"
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* CATEGORY */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Category *
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Electronics"
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* BRAND */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Sony"
                      style={styles.input}
                    />
                  </div>

                  {/* PRICE */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Price *
                    </label>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="399.99"
                      min="0"
                      step="0.01"
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* DISCOUNT PRICE */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Discount Price
                    </label>

                    <input
                      type="number"
                      name="discountPrice"
                      value={
                        form.discountPrice
                      }
                      onChange={handleChange}
                      placeholder="349.99"
                      min="0"
                      step="0.01"
                      style={styles.input}
                    />
                  </div>

                  {/* STOCK */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="10"
                      min="0"
                      step="1"
                      style={styles.input}
                    />
                  </div>

                  {/* RATING */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Rating
                    </label>

                    <input
                      type="number"
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                      min="0"
                      max="5"
                      step="0.1"
                      style={styles.input}
                    />
                  </div>

                  {/* REVIEWS */}
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Number of Reviews
                    </label>

                    <input
                      type="number"
                      name="numReviews"
                      value={
                        form.numReviews
                      }
                      onChange={handleChange}
                      placeholder="25"
                      min="0"
                      step="1"
                      style={styles.input}
                    />
                  </div>

                  {/* IMAGE */}
                  <div
                    style={styles.fullField}
                  >
                    <label style={styles.label}>
                      Image URL *
                    </label>

                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://example.com/product.jpg"
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div
                    style={styles.fullField}
                  >
                    <label style={styles.label}>
                      Description *
                    </label>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={handleChange}
                      placeholder="Describe the product..."
                      style={
                        styles.textarea
                      }
                      required
                    />
                  </div>

                  {/* FEATURED */}
                  <div
                    style={styles.fullField}
                  >
                    <label
                      style={styles.checkbox}
                    >
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={
                          form.isFeatured
                        }
                        onChange={handleChange}
                      />

                      <span>
                        ⭐ Mark as featured
                        product
                      </span>
                    </label>
                  </div>
                </div>

                {/* FORM ACTIONS */}
                <div
                  style={styles.formActions}
                >
                  <button
                    type="button"
                    style={
                      styles.cancelButton
                    }
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={styles.saveButton}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingProduct
                        ? "💾 Update Product"
                        : "➕ Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default AdminProducts;

import macbookAirM3 from "../assets/images/products/macbook-air-m3.jpg";
import nikeHoodie from "../assets/images/products/nike-hoodie.webp";
import atomicHabits from "../assets/images/products/atomic-habits.jpg";
import modernOfficeChair from "../assets/images/products/modern-office-chair.jpeg";
import canonEOSR50 from "../assets/images/products/canon-eos-r50.jpg";

function Categories({
  selectedCategory,
  setSelectedCategory,
}) {
  const categories = [
    {
      title: "Electronics",
      filter: "Electronics",
      image: macbookAirM3,
      items: "120+ Products",
    },
    {
      title: "Fashion",
      filter: "Fashion",
      image: nikeHoodie,
      items: "80+ Products",
    },
    {
      title: "Books",
      filter: "Books",
      image: atomicHabits,
      items: "60+ Products",
    },
    {
      title: "Home & Living",
      filter: "Home & Living",
      image: modernOfficeChair,
      items: "95+ Products",
    },
    {
      title: "Cameras",
      filter: "Cameras",
      image: canonEOSR50,
      items: "45+ Products",
    },
  ];

  return (
    <section className="categories-section">

      <div className="section-header">
        <h2>Shop by Category</h2>

        <p>
          Browse our most popular collections.
        </p>
      </div>

      <div className="categories-grid">

        {categories.map((category) => (

          <div
            key={category.title}
            className={`category-card ${
              selectedCategory === category.filter
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory(category.filter)
            }
          >

            <img
              src={category.image}
              alt={category.title}
              className="category-image"
            />

            <div className="category-content">

              <h3>{category.title}</h3>

              <p>{category.items}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Categories;
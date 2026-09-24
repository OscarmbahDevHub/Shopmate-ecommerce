require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Premium wireless noise-cancelling headphones with exceptional sound quality.",
    price: 399.99,
    image: "/images/products/sony-wh1000xm5.jpg",
    category: "Electronics",
    stock: 20,
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Apple AirPods Pro 2",
    description:
      "Wireless earbuds with active noise cancellation and immersive sound.",
    price: 249.99,
    discountPrice: 199.99,
    image: "/images/products/airpods-Pro-2.webp",
    category: "Electronics",
    stock: 35,
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "MacBook Air M3",
    description:
      "Powerful and lightweight Apple laptop with the M3 chip.",
    price: 1299.99,
    discountPrice: 1104.99,
    image: "/images/products/macbook-air-m3.jpg",
    category: "Electronics",
    stock: 12,
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "MacBook Pro M4",
    description:
      "Professional-grade MacBook with powerful M4 performance.",
    price: 1999.99,
    image: "/images/products/macbook-pro-m4.jpg",
    category: "Electronics",
    stock: 10,
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Apple iPhone 16 Pro",
    description:
      "Premium iPhone with advanced performance and professional camera system.",
    price: 999.99,
    image: "/images/products/iphone-16-pro.jpg",
    category: "Electronics",
    stock: 25,
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    description:
      "Flagship Samsung smartphone with powerful performance and advanced cameras.",
    price: 1199.99,
    image: "/images/products/samsung-galaxy-s25-ultra.png",
    category: "Electronics",
    stock: 18,
    rating: 4.8,
  },
  {
    name: "Apple Watch Series 10",
    description:
      "Advanced smartwatch with health, fitness and connectivity features.",
    price: 449.99,
    image: "/images/products/apple-watch-series-10.png",
    category: "Electronics",
    stock: 30,
    rating: 4.7,
  },
  {
    name: "iPad Air",
    description:
      "Powerful and versatile iPad for work, entertainment and creativity.",
    price: 699.99,
    image: "/images/products/ipad-air.webp",
    category: "Electronics",
    stock: 22,
    rating: 4.8,
  },
  {
    name: "PlayStation 5",
    description:
      "Next-generation gaming console with immersive performance.",
    price: 499.99,
    image: "/images/products/playstation-5.jpg",
    category: "Gaming",
    stock: 15,
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Xbox Series X",
    description:
      "High-performance Xbox gaming console.",
    price: 499.99,
    image: "/images/products/xbox-series-x.png",
    category: "Gaming",
    stock: 14,
    rating: 4.8,
  },
  {
    name: "Nintendo Switch OLED",
    description:
      "Portable gaming console with a vibrant OLED display.",
    price: 349.99,
    image: "/images/products/nintendo-switch-oled.png",
    category: "Gaming",
    stock: 20,
    rating: 4.8,
  },
  {
    name: "Dell XPS 13",
    description:
      "Premium compact Windows laptop for productivity and everyday computing.",
    price: 1399.99,
    image: "/images/products/dell-xps-13.jpg",
    category: "Electronics",
    stock: 10,
    rating: 4.7,
  },
  {
    name: "Nike Air Force 1",
    description:
      "Classic Nike sneakers with timeless everyday style.",
    price: 120,
    image: "/images/products/nike-air-force-1.jpg",
    category: "Fashion",
    stock: 40,
    rating: 4.8,
  },
  {
    name: "Adidas Ultraboost",
    description:
      "Comfortable performance running shoes with responsive cushioning.",
    price: 180,
    image: "/images/products/adidas-ultraboost.webp",
    category: "Fashion",
    stock: 25,
    rating: 4.7,
  },
  {
    name: "New Balance 9060",
    description:
      "Modern lifestyle sneakers combining comfort and bold design.",
    price: 160,
    image: "/images/products/new-balance-9060.webp",
    category: "Fashion",
    stock: 22,
    rating: 4.7,
  },
  {
    name: "Nike Hoodie",
    description:
      "Comfortable everyday Nike hoodie.",
    price: 79.99,
    image: "/images/products/nike-hoodie.webp",
    category: "Fashion",
    stock: 45,
    rating: 4.6,
  },
  {
    name: "Levi's 501 Jeans",
    description:
      "Classic Levi's jeans designed for everyday wear.",
    price: 89.99,
    image: "/images/products/levis-501-jeans.jpg",
    category: "Fashion",
    stock: 30,
    rating: 4.7,
  },
  {
    name: "Adidas Essentials T-Shirt",
    description:
      "Simple and comfortable Adidas everyday T-shirt.",
    price: 35,
    image: "/images/products/adidas-essentials-tshirt.jpg",
    category: "Fashion",
    stock: 50,
    rating: 4.5,
  },
  {
    name: "Atomic Habits",
    description:
      "A practical book about building good habits and breaking bad ones.",
    price: 18.99,
    image: "/images/products/atomic-habits.jpg",
    category: "Books",
    stock: 60,
    rating: 4.9,
  },
  {
    name: "The Psychology of Money",
    description:
      "Insights into how people think about money, investing and wealth.",
    price: 17.99,
    image: "/images/products/the-psychology-of-money.jpg",
    category: "Books",
    stock: 55,
    rating: 4.9,
  },
  {
    name: "Deep Work",
    description:
      "A guide to focused work and improving productivity.",
    price: 19.99,
    image: "/images/products/deep-work.webp",
    category: "Books",
    stock: 45,
    rating: 4.8,
  },
  {
    name: "Modern Office Chair",
    description:
      "Comfortable modern office chair for work and study.",
    price: 249.99,
    discountPrice: 212.49,
    image: "/images/products/modern-office-chair.jpeg",
    category: "Home & Living",
    stock: 12,
    rating: 4.6,
  },
  {
    name: "Wooden Coffee Table",
    description:
      "Stylish wooden coffee table for modern living spaces.",
    price: 179.99,
    discountPrice: 161.99,
    image: "/images/products/wooden-coffee-table.webp",
    category: "Home & Living",
    stock: 10,
    rating: 4.5,
  },
  {
    name: "LED Floor Lamp",
    description:
      "Modern LED floor lamp for home and office spaces.",
    price: 89.99,
    image: "/images/products/led-floor-lamp.webp",
    category: "Home & Living",
    stock: 20,
    rating: 4.6,
  },
  {
    name: "Air Fryer",
    description:
      "Convenient air fryer for preparing crispy meals with less oil.",
    price: 129.99,
    image: "/images/products/air-fryer.webp",
    category: "Home & Living",
    stock: 18,
    rating: 4.8,
  },
  {
    name: "Blender",
    description:
      "Powerful kitchen blender for smoothies and everyday food preparation.",
    price: 69.99,
    image: "/images/products/blender.jpg",
    category: "Home & Living",
    stock: 25,
    rating: 4.5,
  },
  {
    name: "Robot Vacuum Cleaner",
    description:
      "Smart robotic vacuum cleaner for convenient home cleaning.",
    price: 349.99,
    image: "/images/products/robot-vacuum-cleaner.jpg",
    category: "Home & Living",
    stock: 10,
    rating: 4.7,
  },
  {
    name: "Canon EOS R50 Camera",
    description:
      "Compact mirrorless camera for photography and content creation.",
    price: 799.99,
    image: "/images/products/canon-eos-r50.jpg",
    category: "Cameras",
    stock: 8,
    rating: 4.8,
  },
  {
    name: "Kindle Paperwhite",
    description:
      "Waterproof e-reader with a high-resolution display.",
    price: 149.99,
    image: "/images/products/kindle-paperwhite.jpg",
    category: "Electronics",
    stock: 28,
    rating: 4.8,
  },
  {
    name: "LG 55-inch 4K Smart TV",
    description:
      "Large 4K smart television for movies, shows and entertainment.",
    price: 699.99,
    image: "/images/products/lg-55-inch-4k-smart-tv.jpg",
    category: "Electronics",
    stock: 9,
    rating: 4.8,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await Product.deleteMany({});

    console.log("🗑️ Existing products cleared");

    const createdProducts = await Product.insertMany(products);

    console.log(
      `✅ ${createdProducts.length} products added successfully`
    );

    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Product Seed Error:");
    console.error(error);

    process.exit(1);
  }
};

seedProducts();
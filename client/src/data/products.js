import sonyWH1000XM5 from "../assets/images/products/sony-wh1000xm5.jpg";
import airpodsPro2 from "../assets/images/products/airpods-Pro-2.webp";
import macbookAirM3 from "../assets/images/products/macbook-air-m3.jpg";
import macbookProM4 from "../assets/images/products/macbook-pro-m4.jpg";
import iphone16Pro from "../assets/images/products/iphone-16-pro.jpg";
import samsungGalaxyS25Ultra from "../assets/images/products/samsung-galaxy-s25-ultra.png";
import appleWatchSeries10 from "../assets/images/products/apple-watch-series-10.png";
import ipadAir from "../assets/images/products/ipad-air.webp";
import playstation5 from "../assets/images/products/playstation-5.jpg";
import xboxSeriesX from "../assets/images/products/xbox-series-x.png";
import nintendoSwitchOLED from "../assets/images/products/nintendo-switch-oled.png";
import dellXPS13 from "../assets/images/products/dell-xps-13.jpg";
import nikeAirForce1 from "../assets/images/products/nike-air-force-1.jpg";
import adidasUltraboost from "../assets/images/products/adidas-ultraboost.webp";
import newBalance9060 from "../assets/images/products/new-balance-9060.webp";
import nikeHoodie from "../assets/images/products/nike-hoodie.webp";
import levis501Jeans from "../assets/images/products/levis-501-jeans.jpg";
import adidasEssentialsTShirt from "../assets/images/products/adidas-essentials-tshirt.jpg";
import atomicHabits from "../assets/images/products/atomic-habits.jpg";
import thePsychologyOfMoney from "../assets/images/products/the-psychology-of-money.jpg";
import deepWork from "../assets/images/products/deep-work.webp";
import modernOfficeChair from "../assets/images/products/modern-office-chair.jpeg";
import woodenCoffeeTable from "../assets/images/products/wooden-coffee-table.webp";
import ledFloorLamp from "../assets/images/products/led-floor-lamp.webp";
import airFryer from "../assets/images/products/air-fryer.webp";
import blender from "../assets/images/products/blender.jpg";
import robotVacuumCleaner from "../assets/images/products/robot-vacuum-cleaner.jpg";
import canonEOSR50 from "../assets/images/products/canon-eos-r50.jpg";
import kindlePaperwhite from "../assets/images/products/kindle-paperwhite.jpg";
import lg55Inch4KSmartTV from "../assets/images/products/lg-55-inch-4k-smart-tv.jpg";

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    price: 399.99,
    image: sonyWH1000XM5,
    rating: 4.9,
    stock: 20,
  },
  {
    id: 2,
    name: "Apple AirPods Pro 2",
    category: "Electronics",
    price: 249.99,
    discount: 20,
    image: airpodsPro2,
    rating: 4.8,
    stock: 35,
  },
  {
    id: 3,
    name: "MacBook Air M3",
    category: "Electronics",
    price: 1299.99,
    discount: 15,
    image: macbookAirM3,
    rating: 4.9,
    stock: 12,
  },
  {
    id: 4,
    name: "MacBook Pro M4",
    category: "Electronics",
    price: 1999.99,
    image: macbookProM4,
    rating: 4.9,
    stock: 10,
  },
  {
    id: 5,
    name: "Apple iPhone 16 Pro",
    category: "Electronics",
    price: 999.99,
    image: iphone16Pro,
    rating: 4.8,
    stock: 25,
  },
  {
    id: 6,
    name: "Samsung Galaxy S25 Ultra",
    category: "Electronics",
    price: 1199.99,
    image: samsungGalaxyS25Ultra,
    rating: 4.8,
    stock: 18,
  },
  {
    id: 7,
    name: "Apple Watch Series 10",
    category: "Electronics",
    price: 449.99,
    image: appleWatchSeries10,
    rating: 4.7,
    stock: 30,
  },
  {
    id: 8,
    name: "iPad Air",
    category: "Electronics",
    price: 699.99,
    image: ipadAir,
    rating: 4.8,
    stock: 22,
  },
  {
    id: 9,
    name: "PlayStation 5",
    category: "Gaming",
    price: 499.99,
    image: playstation5,
    rating: 4.9,
    stock: 15,
  },
  {
    id: 10,
    name: "Xbox Series X",
    category: "Gaming",
    price: 499.99,
    image: xboxSeriesX,
    rating: 4.8,
    stock: 14,
  },
  {
    id: 11,
    name: "Nintendo Switch OLED",
    category: "Gaming",
    price: 349.99,
    image: nintendoSwitchOLED,
    rating: 4.8,
    stock: 20,
  },
  {
    id: 12,
    name: "Dell XPS 13",
    category: "Electronics",
    price: 1399.99,
    image: dellXPS13,
    rating: 4.7,
    stock: 10,
  },
  {
    id: 13,
    name: "Nike Air Force 1",
    category: "Fashion",
    price: 120.00,
    image: nikeAirForce1,
    rating: 4.8,
    stock: 40,
  },
  {
    id: 14,
    name: "Adidas Ultraboost",
    category: "Fashion",
    price: 180.00,
    image: adidasUltraboost,
    rating: 4.7,
    stock: 25,
  },
  {
    id: 15,
    name: "New Balance 9060",
    category: "Fashion",
    price: 160.00,
    image: newBalance9060,
    rating: 4.7,
    stock: 22,
  },
  {
    id: 16,
    name: "Nike Hoodie",
    category: "Fashion",
    price: 79.99,
    image: nikeHoodie,
    rating: 4.6,
    stock: 45,
  },
  {
    id: 17,
    name: "Levi's 501 Jeans",
    category: "Fashion",
    price: 89.99,
    image: levis501Jeans,
    rating: 4.7,
    stock: 30,
  },
  {
    id: 18,
    name: "Adidas Essentials T-Shirt",
    category: "Fashion",
    price: 35.00,
    image: adidasEssentialsTShirt,
    rating: 4.5,
    stock: 50,
  },
  {
    id: 19,
    name: "Atomic Habits",
    category: "Books",
    price: 18.99,
    image: atomicHabits,
    rating: 4.9,
    stock: 60,
  },
  {
    id: 20,
    name: "The Psychology of Money",
    category: "Books",
    price: 17.99,
    image: thePsychologyOfMoney,
    rating: 4.9,
    stock: 55,
  },
  {
    id: 21,
    name: "Deep Work",
    category: "Books",
    price: 19.99,
    image: deepWork,
    rating: 4.8,
    stock: 45,
  },
  {
    id: 22,
    name: "Modern Office Chair",
    category: "Home & Living",
    price: 249.99,
    discount: 15,
    image: modernOfficeChair,
    rating: 4.6,
    stock: 12,
  },
  {
    id: 23,
    name: "Wooden Coffee Table",
    category: "Home & Living",
    price: 179.99,
    discount: 10,
    image: woodenCoffeeTable,
    rating: 4.5,
    stock: 10,
  },
  {
    id: 24,
    name: "LED Floor Lamp",
    category: "Home & Living",
    price: 89.99,
    image: ledFloorLamp,
    rating: 4.6,
    stock: 20,
  },
  {
    id: 25,
    name: "Air Fryer",
    category: "Home & Living",
    price: 129.99,
    image: airFryer,
    rating: 4.8,
    stock: 18,
  },
  {
    id: 26,
    name: "Blender",
    category: "Home & Living",
    price: 69.99,
    image: blender,
    rating: 4.5,
    stock: 25,
  },
  {
    id: 27,
    name: "Robot Vacuum Cleaner",
    category: "Home & Living",
    price: 349.99,
    image: robotVacuumCleaner,
    rating: 4.7,
    stock: 10,
  },
  {
    id: 28,
    name: "Canon EOS R50 Camera",
    category: "Cameras",
    price: 799.99,
    image: canonEOSR50,
    rating: 4.8,
    stock: 8,
  },
  {
    id: 29,
    name: "Kindle Paperwhite",
    category: "Electronics",
    price: 149.99,
    image: kindlePaperwhite,
    rating: 4.8,
    stock: 28,
  },
  {
    id: 30,
    name: "LG 55-inch 4K Smart TV",
    category: "Electronics",
    price: 699.99,
    image: lg55Inch4KSmartTV,
    rating: 4.8,
    stock: 9,
  },
];

export default products;
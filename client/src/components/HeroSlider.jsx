import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

import products from "../data/products";

function HeroSlider() {
  const slides = [
    {
      title: "Power Meets Performance",
      subtitle: "MacBook Pro M4",
      image: products[3].image,
      button: "Shop Now",
    },
    {
      title: "Experience the Future",
      subtitle: "iPhone 16 Pro",
      image: products[4].image,
      button: "Explore",
    },
    {
      title: "Hear Every Detail",
      subtitle: "Sony WH-1000XM5",
      image: products[0].image,
      button: "Buy Now",
    },
    {
      title: "Upgrade Your Lifestyle",
      subtitle: "Apple Watch Series 10",
      image: products[6].image,
      button: "View Product",
    },
  ];

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="hero-slide">
              <div className="hero-slide-text">
                <span>NEW COLLECTION</span>

                <h1>{slide.title}</h1>

                <p>{slide.subtitle}</p>

                <Link to="/products" className="primary-btn">
                  {slide.button}
                </Link>
              </div>

              <div className="hero-slide-image">
                <img src={slide.image} alt={slide.subtitle} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;
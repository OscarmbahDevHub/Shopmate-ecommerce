import MainLayout from "../layouts/MainLayout";
import {
  FaUsers,
  FaAward,
  FaTruck,
  FaHeadset,
  FaBullseye,
  FaEye,
  FaShoppingBag,
  FaShieldAlt,
} from "react-icons/fa";

function About({
  cartCount,
  searchTerm,
  setSearchTerm,
  user,
  setUser,
}) {
  const stats = [
    {
      icon: <FaUsers />,
      number: "50,000+",
      title: "Happy Customers",
    },
    {
      icon: <FaShoppingBag />,
      number: "10,000+",
      title: "Products Sold",
    },
    {
      icon: <FaAward />,
      number: "5+",
      title: "Years Experience",
    },
    {
      icon: <FaTruck />,
      number: "100+",
      title: "Countries Served",
    },
  ];

  const features = [
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      text: "We deliver your products quickly and safely with trusted logistics partners.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Shopping",
      text: "Your personal information and payments are protected with industry-standard security.",
    },
    {
      icon: <FaAward />,
      title: "Premium Quality",
      text: "Every product is carefully selected to ensure exceptional quality.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      text: "Our customer support team is always available whenever you need assistance.",
    },
  ];

  const team = [
    {
      name: "Michael Johnson",
      role: "Founder & CEO",
      image: "https://i.pravatar.cc/300?img=12",
    },
    {
      name: "Sarah Williams",
      role: "Marketing Director",
      image: "https://i.pravatar.cc/300?img=32",
    },
    {
      name: "David Smith",
      role: "Product Manager",
      image: "https://i.pravatar.cc/300?img=15",
    },
  ];

  const testimonials = [
    {
      name: "Emily Carter",
      review:
        "ShopMate has completely changed my online shopping experience. The delivery is always fast and the products are excellent.",
    },
    {
      name: "Daniel James",
      review:
        "The customer support is outstanding. I highly recommend ShopMate to anyone looking for premium products.",
    },
    {
      name: "Sophia Brown",
      review:
        "Beautiful website, amazing prices and excellent service. I'll definitely shop here again.",
    },
  ];

  return (
    <MainLayout
      cartCount={cartCount}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      user={user}
      setUser={setUser}
    >
      <section className="about-hero">
        <div className="container">
          <h1>About ShopMate</h1>

          <p>
            ShopMate is your trusted destination for premium products,
            exceptional customer service, and a shopping experience
            designed around you.
          </p>
        </div>
      </section>

      <section className="about-story container">
        <div className="about-content">
          <div>
            <h2>Our Story</h2>

            <p>
              Founded with a passion for delivering quality products,
              ShopMate was created to make online shopping simple,
              secure and enjoyable. We believe every customer deserves
              access to premium products without sacrificing affordability.
            </p>

            <p>
              Today, thousands of customers trust ShopMate for fashion,
              electronics, home essentials and lifestyle products. We
              continue to grow while maintaining our commitment to
              excellence, transparency and customer satisfaction.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900"
            alt="About ShopMate"
          />
        </div>
      </section>

      <section className="mission-vision container">
        <div className="mission-card">
          <FaBullseye className="mv-icon" />

          <h2>Our Mission</h2>

          <p>
            To make premium shopping accessible through innovation,
            affordability and world-class customer service.
          </p>
        </div>

        <div className="mission-card">
          <FaEye className="mv-icon" />

          <h2>Our Vision</h2>

          <p>
            To become one of the world's most trusted online shopping
            platforms by continuously exceeding customer expectations.
          </p>
        </div>
      </section>

      <section className="why-us container">
        <div className="section-title">
          <h2>Why Choose ShopMate?</h2>

          <p>
            We combine technology, quality and customer satisfaction
            into one shopping experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="feature-card"
              key={index}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((item, index) => (
            <div
              key={index}
              className="stat-card"
            >
              <div className="stat-icon">
                {item.icon}
              </div>

              <h2>{item.number}</h2>

              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section container">
        <div className="section-title">
          <h2>Meet Our Team</h2>

          <p>
            Passionate professionals committed to delivering excellence.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <div
              className="team-card"
              key={index}
            >
              <img
                src={member.image}
                alt={member.name}
              />

              <h3>{member.name}</h3>

              <span>{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonial-section container">
        <div className="section-title">
          <h2>What Our Customers Say</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((review, index) => (
            <div
              className="testimonial-card"
              key={index}
            >
              <p>"{review.review}"</p>

              <h4>{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <h2>Join Thousands of Happy Customers</h2>

          <p>
            Experience premium shopping with trusted quality,
            unbeatable prices and outstanding customer service.
          </p>

          <a
            href="/products"
            className="about-btn"
          >
            Start Shopping
          </a>
        </div>
      </section>
    </MainLayout>
  );
}

export default About;
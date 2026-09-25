import MainLayout from "../Layouts/MainLayout";
import "../styles/main.css";

function Contact({
  cartCount,
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
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. Whether you have a question,
          feedback, or need support, we're here to help.
        </p>
      </section>

      <section className="contact-container">

        <div className="contact-info">

  <h2>Get in Touch</h2>

  <div className="info-box">
    <h3>🌍 Global Support</h3>
    <p>
      ShopMate is a global e-commerce platform serving customers
      worldwide with premium products and exceptional service.
    </p>
  </div>

  <div className="info-box">
    <h3>📧 Email</h3>
    <p>support@shopmate.com</p>
  </div>

  <div className="info-box">
    <h3>📞 Customer Support</h3>
    <p>+1 (800) 555-0123</p>
    <small>*Demo contact for portfolio purposes.</small>
  </div>

  <div className="info-box">
    <h3>🕒 Support Hours</h3>
    <p>
      Monday – Saturday
      <br />
      9:00 AM – 6:00 PM (UTC)
    </p>
  </div>

</div>

        <div className="contact-form">

          <h2>Send a Message</h2>

          <form>

            <input
              type="text"
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              required
            />

            <input
              type="text"
              placeholder="Subject"
              required
            />

            <textarea
              rows="7"
              placeholder="Write your message..."
              required
            />

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </section>

      <section className="faq-section">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-grid">

          <div className="faq-card">
            <h3>How long does delivery take?</h3>
            <p>
              Most orders arrive within 2–5 business days.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can I return an item?</h3>
            <p>
              Yes. Returns are accepted within 30 days of purchase.
            </p>
          </div>

          <div className="faq-card">
            <h3>How can I track my order?</h3>
            <p>
              You'll receive a tracking number by email after shipment.
            </p>
          </div>

          <div className="faq-card">
            <h3>Do you offer customer support?</h3>
            <p>
              Yes. Our support team is available six days a week.
            </p>
          </div>

        </div>

      </section>

    </MainLayout>
  );
}

export default Contact;

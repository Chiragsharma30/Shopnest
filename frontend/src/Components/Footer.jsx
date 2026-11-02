function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h2>🛒 ShopNest</h2>

          <p>
            Your one-stop destination for quality products,
            amazing deals and a better shopping experience.
          </p>

          <div className="social-links">
            <span>𝕏</span>
            <span>in</span>
            <span>◎</span>
            <span>▶</span>
          </div>
        </div>


        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <a href="/orders">My Orders</a>
        </div>


        {/* Customer Service */}
        <div className="footer-column">
          <h3>Customer Service</h3>

          <a href="#">Contact Us</a>
          <a href="#">FAQs</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Return Policy</a>
        </div>


        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>📍 Jaipur, Rajasthan</p>
          <p>📧 support@shopnest.com</p>
          <p>📞 +91 98765 43210</p>
        </div>

      </div>


      <div className="footer-bottom">
        <p>© 2026 ShopNest. All rights reserved.</p>

        <div>
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
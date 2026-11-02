
import { useEffect, useState } from "react";
import { Link } from "react-router";
import categories from "../Data/categories";
import CategoryCard from "../Components/CategoryCard";
import ProductCard from "../Components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/products",
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load products.");
        }

        setProducts(data.products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load products.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small-text">NEW COLLECTION 2026</p>

          <h1>
            Discover
            <br />
            Trendy Products
            <br />
            <span>For Your Lifestyle</span>
          </h1>

          <p className="hero-description">
            Best quality, great prices and amazing deals.
            Find everything you need in one place.
          </p>

          <Link to="/products" className="shop-now-btn">
            Shop Now →
          </Link>
        </div>

        <div className="hero-image">
          <div className="hero-image-content">
            <span>NEW</span>
            <h2>
              Shop
              <br />
              Your Style
            </h2>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits">
        <div className="benefit-card">
          <div className="benefit-icon">🚚</div>
          <div>
            <h3>Free Delivery</h3>
            <p>On orders above ₹999</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon">↩️</div>
          <div>
            <h3>Easy Returns</h3>
            <p>7 days easy return policy</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon">🔒</div>
          <div>
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon">⭐</div>
          <div>
            <h3>Best Quality</h3>
            <p>Premium quality products</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="section-header">
          <div>
            <p className="section-subtitle">EXPLORE OUR COLLECTION</p>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/products" className="view-all-btn">
            View All →
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS FROM MONGODB */}
      <section className="products-section">
        <div className="section-header">
          <div>
            <p className="section-subtitle">OUR BEST PICKS</p>
            <h2>Featured Products</h2>
          </div>

          <Link to="/products" className="view-all-btn">
            View All →
          </Link>
        </div>

        {loading ? (
          <p>Loading featured products...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : products.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="products-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* OFFER BANNER */}
      <section className="offer-banner">
        <div className="offer-content">
          <p className="offer-small-text">LIMITED TIME OFFER</p>

          <h2>
            Get Up To <span>50% OFF</span>
          </h2>

          <p>
            Grab your favorite products at amazing prices.
            Don't miss out on today's best deals.
          </p>

          <Link to="/products" className="offer-btn">
            Shop Offers →
          </Link>
        </div>

        <div className="offer-visual">
          <span>🛍️</span>
        </div>
      </section>
    </div>
  );
}

export default Home;

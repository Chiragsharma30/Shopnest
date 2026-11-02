
import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Shoes",
    "Accessories",
    "Clothing",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }

    return 0;
  });

  return (
    <div className="products-page">
      <section className="products-header">
        <p>OUR COLLECTION</p>
        <h1>All Products</h1>
        <span>Discover products made for your lifestyle.</span>
      </section>

      <section className="products-controls">
        <div className="products-search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span>🔍</span>
        </div>

        <div className="category-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="sort-box">
          <label>Sort By:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </section>

      <div className="products-result">
        <p>
          Showing <strong>{filteredProducts.length}</strong> products
        </p>
      </div>

      <section className="products-grid products-page-grid">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <div className="no-products">
            <h2>Unable to load products</h2>
            <p>{error}</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))
        ) : (
          <div className="no-products">
            <span>🔎</span>
            <h2>No products found</h2>
            <p>Try searching with a different keyword.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;

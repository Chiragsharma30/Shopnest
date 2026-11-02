
import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Services/productService";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM });

  // LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      setError("");

      const data = await getProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // LOAD ORDERS
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin.");
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // DASHBOARD STATISTICS
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  const totalCustomers = new Set(
    orders
      .map((order) => order.user)
      .filter(Boolean)
      .map((user) => String(user))
  ).size;

  // FORM INPUT
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      image: product.image || "",
      stock: String(product.stock ?? ""),
    });

    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setMessage("");
  };

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        image: form.image.trim(),
        stock: Number(form.stock),
      };

      if (
        !productData.name ||
        !productData.description ||
        !productData.category ||
        form.price === "" ||
        form.stock === "" ||
        !Number.isFinite(productData.price) ||
        productData.price < 0 ||
        !Number.isInteger(productData.stock) ||
        productData.stock < 0
      ) {
        throw new Error("Please enter valid product details.");
      }

      if (editingId) {
        await updateProduct(editingId, productData);
        setMessage("Product updated successfully!");
      } else {
        await createProduct(productData);
        setMessage("Product added successfully!");
      }

      setEditingId(null);
      setForm({ ...EMPTY_FORM });

      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteProduct(product._id);

      if (editingId === product._id) {
        handleCancelEdit();
      }

      setMessage("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <main className="admin-dashboard">

      <h1>ShopNest Admin Dashboard</h1>
      <p>Manage your online store from one place.</p>

      {/* DASHBOARD STATISTICS */}
      <section className="admin-stats">

        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{loading ? "..." : totalProducts}</p>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{ordersLoading ? "..." : totalOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>
            {ordersLoading
              ? "..."
              : `₹${totalRevenue.toLocaleString("en-IN")}`}
          </p>
        </div>

        <div className="stat-card">
          <h3>Customers with Orders</h3>
          <p>{ordersLoading ? "..." : totalCustomers}</p>
        </div>

      </section>

      {/* ADMIN NAVIGATION */}
      <section className="admin-navigation">
        <h2>Quick Actions</h2>

        <Link to="/admin/orders" className="admin-action-link">
          Manage Orders
        </Link>

        <a href="#manage-products" className="admin-action-link">
          Manage Products
        </a>
      </section>

      {/* PRODUCT FORM */}
      <section id="manage-products">

        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="image"
            type="url"
            placeholder="Product image URL (optional)"
            value={form.image}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock quantity"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}

        </form>

      </section>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {/* PRODUCT LIST */}
      <section>
        <h2>Products ({products.length})</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="admin-product">

              <h3>{product.name}</h3>

              <p>Category: {product.category}</p>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.stock}</p>

              <button
                type="button"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>

            </div>
          ))
        )}
      </section>

    </main>
  );
}

export default AdminDashboard;

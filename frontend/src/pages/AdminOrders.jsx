
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const ORDER_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  const fetchOrders = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as admin.");
      }

      const response = await fetch(API_URL, {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load orders.");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);

    return () => controller.abort();
  }, [fetchOrders]);

  async function updateStatus(orderId, status) {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      setMessage(`Order ${data.order.orderNumber} updated to ${status}.`);
    } catch (err) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return <div className="admin-orders"><p>Loading orders...</p></div>;
  }

  return (
    <div className="admin-orders">
      <h1>Manage Orders</h1>
      <p>Total Orders: {orders.length}</p>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <article key={order._id} className="admin-order-card">
            <h3>{order.orderNumber}</h3>
            <p>Customer: {order.customer?.fullName}</p>
            <p>Email: {order.customer?.email}</p>
            <p>Total: ₹{order.total}</p>
            <p>
              Ordered on:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                : "N/A"}
            </p>

            <h4>Products</h4>
            <ul>
              {order.items?.map((item, index) => (
                <li key={`${item.productId || item.name}-${index}`}>
                  {item.name} × {item.quantity} — ₹
                  {item.price * item.quantity}
                </li>
              ))}
            </ul>

            <label htmlFor={`status-${order._id}`}>
              Order Status
            </label>

            <select
              id={`status-${order._id}`}
              value={order.status}
              disabled={updatingId === order._id}
              onChange={(event) =>
                updateStatus(order._id, event.target.value)
              }
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {updatingId === order._id && <p>Updating status...</p>}
          </article>
        ))
      )}

      <Link to="/admin">Back to Dashboard</Link>
    </div>
  );
}

export default AdminOrders;

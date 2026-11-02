
import { useEffect, useState } from "react";
import { Link } from "react-router";

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const TRACKING_STEPS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view your orders.");
        }

        const response = await fetch(API_URL, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load orders.");
        }

        setOrders(data.orders || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load orders.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => controller.abort();
  }, []);

  const money = (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

  const date = (value) => {
    if (!value) return "Date unavailable";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <header className="orders-heading">
          <p className="orders-eyebrow">YOUR SHOPPING HISTORY</p>
          <h1>My Orders</h1>
        </header>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <header className="orders-heading">
        <p className="orders-eyebrow">YOUR SHOPPING HISTORY</p>
        <h1>My Orders</h1>
        <p>View your purchases and delivery details in one place.</p>
      </header>

      {error && (
        <div role="alert">
          <p>Could not load orders: {error}</p>
          <p>Please make sure you are logged in and the backend is running.</p>
        </div>
      )}

      {!error && orders.length === 0 ? (
        <section className="orders-empty">
          <div className="orders-empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/products" className="orders-shop-button">
            Explore Products →
          </Link>
        </section>
      ) : (
        !error && (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStatus = order.status || "Order Placed";
              const currentIndex = TRACKING_STEPS.indexOf(currentStatus);

              return (
                <article
                  className="order-card"
                  key={order._id || order.orderNumber}
                >
                  <header className="order-card-header">
                    <div>
                      <span className="order-label">ORDER NUMBER</span>
                      <h2 className="order-id">{order.orderNumber}</h2>
                    </div>

                    <span className="order-status">
                      <span className="order-status-dot" />
                      {currentStatus}
                    </span>
                  </header>

                  {currentStatus === "Cancelled" ? (
                    <div className="tracking-cancelled">
                      <strong>Order Cancelled</strong>
                      <p>This order has been cancelled.</p>
                    </div>
                  ) : (
                    <div className="order-tracking">
                      <h3>Order Tracking</h3>

                      <div className="tracking-steps">
                        {TRACKING_STEPS.map((step, index) => {
                          const completed = index <= currentIndex;

                          return (
                            <div
                              key={step}
                              className={`tracking-step ${
                                completed ? "completed" : ""
                              }`}
                            >
                              <div className="tracking-circle">
                                {completed ? "✓" : index + 1}
                              </div>
                              <span>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="order-meta">
                    <div className="order-meta-item">
                      <span>Order date</span>
                      <strong>{date(order.createdAt || order.placedAt)}</strong>
                    </div>

                    <div className="order-meta-item">
                      <span>Payment method</span>
                      <strong>{order.paymentMethod || "Not specified"}</strong>
                    </div>

                    <div className="order-meta-item">
                      <span>Total amount</span>
                      <strong className="order-total">
                        {money(order.total)}
                      </strong>
                    </div>
                  </div>

                  <div className="order-products">
                    <h3>Items in this order</h3>

                    {(order.items || []).map((item, index) => (
                      <div
                        className="order-product"
                        key={`${item.productId || item.name}-${index}`}
                      >
                        <div className="order-product-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>

                        <div className="order-product-info">
                          <span className="order-product-name">
                            {item.name}
                          </span>
                          <span>{item.category}</span>
                          <span>Quantity: {item.quantity}</span>
                        </div>

                        <strong className="order-product-price">
                          {money(Number(item.price) * Number(item.quantity))}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <footer className="order-delivery">
                    <div className="order-delivery-icon">📍</div>
                    <div>
                      <h3>Delivery address</h3>
                      <p>
                        {order.customer?.fullName}
                        {" · "}
                        {order.customer?.address},{" "}
                        {order.customer?.city},{" "}
                        {order.customer?.state} -{" "}
                        {order.customer?.postalCode}
                      </p>
                    </div>
                  </footer>
                </article>
              );
            })}

            <Link to="/products" className="orders-continue-link">
              ← Continue shopping
            </Link>
          </div>
        )
      )}
    </div>
  );
}

export default Orders;

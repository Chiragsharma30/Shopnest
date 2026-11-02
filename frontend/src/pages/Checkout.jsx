
import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../Context/CartContext.jsx";

function Checkout() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    placeOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || cartItems.length === 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in before placing an order.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customer: formData,
            paymentMethod: formData.paymentMethod,
            items: cartItems.map((item) => ({
              productId: item._id || item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.order) {
        throw new Error(
          data.message || "Could not place your order."
        );
      }

      const savedOrder = data.order;

      // Backend success ke baad hi local cart clear hoga.
      placeOrder(formData);

      setPlacedOrder({
        id: savedOrder.orderNumber,
        customer: savedOrder.customer,
        items: savedOrder.items,
        total: savedOrder.total,
        placedAt: savedOrder.createdAt,
        status: savedOrder.status,
      });
    } catch (error) {
      setSubmitError(
        error.message ||
        "Unable to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatPrice = (price) =>
    `₹${Number(price ?? 0).toLocaleString("en-IN")}`;

  // Order confirmation screen
  if (placedOrder) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you, {placedOrder.customer.fullName}.
            Your order has been saved.
          </p>

          <div className="checkout-order-number">
            Order ID: <strong>{placedOrder.id}</strong>
          </div>

          <p>
            Total:{" "}
            <strong>{formatPrice(placedOrder.total)}</strong>
          </p>

          <p className="checkout-demo-note">
            This is a demo checkout. No payment was processed.
          </p>

          <Link
            to="/orders"
            className="checkout-submit-button"
          >
            View My Orders →
          </Link>

          <p>
            <Link to="/products">Continue Shopping</Link>
          </p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add products before proceeding to checkout.</p>

          <Link
            to="/products"
            className="checkout-submit-button"
          >
            Explore Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <p>ALMOST THERE</p>
        <h1>Checkout</h1>
        <span>
          Enter your delivery details to place your order.
        </span>
      </div>

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >
        {/* Delivery Form */}
        <section className="checkout-form-panel">
          <h2>Delivery Information</h2>

          <p className="checkout-panel-description">
            Where should we deliver your order?
          </p>

          <div className="checkout-form-grid">
            <div className="checkout-field full-width">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                minLength={2}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number."
                required
              />
            </div>

            <div className="checkout-field full-width">
              <label htmlFor="address">Street Address</label>
              <textarea
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="House number, street, area"
                value={formData.address}
                onChange={handleChange}
                minLength={5}
                rows={3}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="state">State</label>
              <input
                id="state"
                name="state"
                autoComplete="address-level1"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="postalCode">PIN Code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="6-digit PIN code"
                value={formData.postalCode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit PIN code."
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Cash on Delivery">
                  Cash on Delivery
                </option>
                <option value="UPI (Demo)">
                  UPI (Demo)
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <h2>Your Order</h2>

          <div className="checkout-products">
            {cartItems.map((item) => (
              <div
                className="checkout-product"
                key={item._id || item.id}
              >
                <div className="checkout-product-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>No image</span>
                  )}

                  <small>{item.quantity}</small>
                </div>

                <div className="checkout-product-info">
                  <strong>{item.name}</strong>
                  <span>
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>

                <strong className="checkout-line-total">
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-summary-row">
            <span>Items ({cartCount})</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="checkout-summary-row">
            <span>Shipping</span>
            <span className="checkout-free">FREE</span>
          </div>

          <div className="checkout-grand-total">
            <strong>Total</strong>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <p className="checkout-payment-note">
            Payment gateway is not connected. No online
            payment will be processed.
          </p>

          {submitError && (
            <p role="alert" className="checkout-error">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="checkout-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Placing Order..."
              : "Place Order →"}
          </button>

          <Link
            to="/cart"
            className="checkout-back-link"
          >
            ← Return to Cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;

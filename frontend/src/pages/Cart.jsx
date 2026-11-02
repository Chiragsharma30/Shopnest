
import { Link } from "react-router";
import { useCart } from "../Context/CartContext.jsx";

function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-heading">
          <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
          <h1>My Cart</h1>
        </div>

        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>

          <Link to="/products" className="cart-continue-button">
            Explore Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-heading">
        <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
        <h1>My Cart</h1>
        <p>
          You have {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart.
        </p>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => {
            const productId = item._id || item.id;

            return (
              <article className="cart-item" key={productId}>
                <div className="cart-item-visual">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-product-image"
                    />
                  ) : (
                    <div className="cart-image-placeholder">🛍️</div>
                  )}
                </div>

                <div className="cart-item-details">
                  <p className="cart-item-category">{item.category}</p>

                  <Link
                    to={`/product/${productId}`}
                    className="cart-item-name"
                  >
                    {item.name}
                  </Link>

                  <p className="cart-item-unit-price">
                    Price: {formatPrice(item.price)}
                  </p>

                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(productId, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() =>
                          updateQuantity(productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeFromCart(productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </article>
            );
          })}

          <Link to="/products" className="cart-back-link">
            ← Continue Shopping
          </Link>
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="cart-summary-row">
            <span>Items ({cartCount})</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span className="cart-free-shipping">FREE</span>
          </div>

          <div className="cart-summary-row cart-total-row">
            <strong>Subtotal</strong>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <p className="cart-summary-note">
            Shipping and any applicable taxes will be confirmed during checkout.
          </p>

          <Link to="/checkout" className="cart-checkout-button">
            Proceed to Checkout →
          </Link>

          <p className="cart-secure-note">🔒 Secure checkout</p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;

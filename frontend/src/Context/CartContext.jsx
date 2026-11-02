
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

function getProductId(product) {
  return String(product._id ?? product.id);
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem("shopnest-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

function loadOrders() {
  try {
    const savedOrders = localStorage.getItem("shopnest-orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    localStorage.setItem("shopnest-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("shopnest-orders", JSON.stringify(orders));
  }, [orders]);

  function addToCart(product, quantity = 1) {
    if (!product || quantity < 1) return;

    const productId = getProductId(product);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => getProductId(item) === productId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          getProductId(item) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentItems,
        { ...product, quantity },
      ];
    });
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => getProductId(item) !== String(productId)
      )
    );
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        getProductId(item) === String(productId)
          ? { ...item, quantity }
          : item
      )
    );
  }

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price ?? 0) * item.quantity,
    0
  );

  function placeOrder(customerDetails) {
    if (cartItems.length === 0) return null;

    const order = {
      id: `SN-${Date.now()}`,
      items: cartItems.map((item) => ({ ...item })),
      total: cartTotal,
      customer: { ...customerDetails },
      placedAt: new Date().toISOString(),
      status: "Order Placed",
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCartItems([]);

    return order;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        orders,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

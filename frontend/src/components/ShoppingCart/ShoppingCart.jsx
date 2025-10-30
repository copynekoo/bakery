import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import "./ShoppingCart.css";

const normalizeCartItems = (items) =>
  items.map((item) => {
    const numericQuantity = Number(item.quantity ?? 0);
    const numericPrice = Number(item.productPrice ?? 0);
    const safeQuantity =
      Number.isFinite(numericQuantity) && numericQuantity > 0 ? numericQuantity : 1;
    return {
      ...item,
      quantity: Number.isFinite(numericQuantity) ? numericQuantity : 0,
      productPrice: Number.isFinite(numericPrice) ? numericPrice : 0,
      orderMethod: "Pre Order",
      localQuantity: String(safeQuantity),
    };
  });

const ShoppingCart = function() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [defaultShippingDestination, setDefaultShippingDestination] = useState("");
  const [useDefaultShipping, setUseDefaultShipping] = useState(true);
  const [customShippingDestination, setCustomShippingDestination] = useState("");
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_DOMAIN + "/api/cart",
          { withCredentials: true }
        );
        if (!cancelled) {
          setCartItems(normalizeCartItems(response.data));
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate({ to: "/login" });
          return;
        }
        const message = err?.response?.data?.message || "Unable to load cart.";
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const fetchDefaultDestination = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_DOMAIN + "/api/profile/defaultshippingdst",
          { withCredentials: true }
        );
        const destination = response.data?.[0]?.defaultshippingdst || "";
        if (!cancelled) {
          setDefaultShippingDestination(destination);
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate({ to: "/login" });
        }
      }
    };

    fetchCart();
    fetchDefaultDestination();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleQuantityInputChange = (productId, value) => {
    setCartItems((items) =>
      items.map((item) =>
        item.productId === productId
          ? { ...item, localQuantity: value }
          : item
      )
    );
  };

  const handleUpdateCartItem = async (productId) => {
    const cartItem = cartItems.find((item) => item.productId === productId);
    if (!cartItem) return;

    const parsedQuantity = Number(cartItem.localQuantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      setActionMessage({ type: "error", text: "Quantity must be at least 1." });
      return;
    }

    try {
      setUpdatingProductId(productId);
      setActionMessage(null);
      const response = await axios.put(
        import.meta.env.VITE_API_DOMAIN + `/api/cart/${productId}`,
        { quantity: parsedQuantity, order_method: "Pre Order" },
        { withCredentials: true }
      );
      setCartItems(normalizeCartItems(response.data));
      setActionMessage({ type: "success", text: "Cart item updated." });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const message = err?.response?.data?.message || "Unable to update cart item.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setUpdatingProductId(productId);
      const response = await axios.delete(
        import.meta.env.VITE_API_DOMAIN + `/api/cart/${productId}`,
        { withCredentials: true }
      );
      setCartItems(normalizeCartItems(response.data));
      setActionMessage({ type: "success", text: "Item removed from cart." });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const message = err?.response?.data?.message || "Unable to remove item.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdatingProductId("all");
      await axios.delete(
        import.meta.env.VITE_API_DOMAIN + "/api/cart",
        { withCredentials: true }
      );
      setCartItems([]);
      setActionMessage({ type: "success", text: "Cart cleared." });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const message = err?.response?.data?.message || "Unable to clear cart.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.productPrice * item.quantity,
        0
      ),
    [cartItems]
  );

  const shippingDestination = useDefaultShipping
    ? defaultShippingDestination
    : customShippingDestination;

  const handleCheckout = async () => {
    if (!cartItems.length) {
      setActionMessage({ type: "error", text: "Your cart is empty." });
      return;
    }

    if (!shippingDestination?.trim()) {
      setActionMessage({ type: "error", text: "Shipping destination is required." });
      return;
    }

    const orderLines = cartItems.reduce((lines, item, index) => {
      lines[String(index + 1)] = {
        product_id: item.productId,
        order_method: "Pre Order",
        quantity: item.quantity,
      };
      return lines;
    }, {});

    try {
      setIsSubmittingOrder(true);
      setActionMessage(null);
      await axios.post(
        import.meta.env.VITE_API_DOMAIN + "/api/orders/purchase",
        [{
          order_lines: orderLines,
          shippingdestination: shippingDestination,
        }],
        { withCredentials: true }
      );
      await axios.delete(
        import.meta.env.VITE_API_DOMAIN + "/api/cart",
        { withCredentials: true }
      );
      setCartItems([]);
      setActionMessage({ type: "success", text: "Order placed successfully. Thank you!" });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const message = err?.response?.data?.message || "Unable to place order.";
      setActionMessage({ type: "error", text: message });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-state">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-state error">{error}</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      {actionMessage && (
        <div className={`cart-message ${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}
      {!cartItems.length ? (
        <div className="cart-state">Your cart is empty.</div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-header">
                  <h2 className="cart-item-name">{item.productName}</h2>
                  <span className="cart-item-category">{item.productCategory}</span>
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-pricing">
                    <div className="cart-item-price">
                      {item.productPrice.toLocaleString("th-TH")} บาท each
                    </div>
                    <div className="cart-item-subtotal">
                      Subtotal: {(item.productPrice * item.quantity).toLocaleString("th-TH")} บาท
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-controls">
                      <label className="cart-quantity-label">
                        Quantity
                        <input
                          type="number"
                          min="1"
                          value={item.localQuantity}
                          onChange={(event) =>
                            handleQuantityInputChange(item.productId, event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <button
                      onClick={() => handleUpdateCartItem(item.productId)}
                      disabled={
                        updatingProductId === item.productId ||
                        Number(item.localQuantity) === item.quantity
                      }
                    >
                      Update
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={updatingProductId === item.productId}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-footer">
                  <span>In stock: {item.remainingStock}</span>
                </div>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>{subtotal.toLocaleString("th-TH")} บาท</span>
            </div>
            <div className="cart-shipping">
              <h3>Shipping Destination</h3>
              <label className="cart-shipping-toggle">
                <input
                  type="checkbox"
                  checked={useDefaultShipping}
                  onChange={() => setUseDefaultShipping((prev) => !prev)}
                />
                Use default shipping destination
              </label>
              <textarea
                rows={4}
                value={useDefaultShipping ? defaultShippingDestination : customShippingDestination}
                onChange={(event) => setCustomShippingDestination(event.target.value)}
                disabled={useDefaultShipping}
              />
            </div>
            <div className="cart-summary-actions">
              <button
                onClick={handleCheckout}
                disabled={isSubmittingOrder || !cartItems.length}
              >
                {isSubmittingOrder ? "Placing order..." : "Place Order"}
              </button>
              <button
                className="secondary"
                onClick={handleClearCart}
                disabled={
                  !cartItems.length ||
                  (updatingProductId !== null && updatingProductId !== "all")
                }
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

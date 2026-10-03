import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { api } from "../api/client";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState("");

  useEffect(() => {
    let active = true;

    api.getCart()
      .then((response) => {
        if (!active) return;
        setCart(response.data.cart);
        setMessage("");
      })
      .catch((error) => {
        if (!active) return;
        setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function updateQuantity(item, quantity) {
    if (quantity < 1) return;

    try {
      setBusyItemId(item.id);
      const response = await api.updateCartItem(item.id, { quantity });
      setCart(response.data.cart);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyItemId("");
    }
  }

  async function removeItem(item) {
    try {
      setBusyItemId(item.id);
      const response = await api.removeCartItem(item.id);
      setCart(response.data.cart);
      setMessage("Item removed from cart.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyItemId("");
    }
  }

  async function clearCart() {
    try {
      setBusyItemId("clear");
      const response = await api.clearCart();
      setCart(response.data.cart);
      setMessage("Cart cleared.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyItemId("");
    }
  }

  const hasItems = cart?.items?.length > 0;

  return (
    <section className="cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Shopping cart</p>
          <h1>Review your items</h1>
        </div>
        <Link className="button-link secondary-link" to="/">Continue shopping</Link>
      </div>

      {message ? <p className="notice">{message}</p> : null}

      {loading ? (
        <div className="cart-layout"><div className="cart-card skeleton" /></div>
      ) : hasItems ? (
        <div className="cart-layout">
          <div className="cart-card cart-items-panel">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-image" aria-hidden="true">
                  {item.product.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="cart-item-copy">
                  <h2>{item.product.name}</h2>
                  <p>{[item.variant.color, item.variant.storage, item.variant.ram].filter(Boolean).join(" / ") || item.variant.sku}</p>
                  <span>{item.variant.sku}</span>
                </div>
                <div className="quantity-stepper" aria-label={`Quantity for ${item.product.name}`}>
                  <button type="button" disabled={busyItemId === item.id || item.quantity <= 1} onClick={() => updateQuantity(item, item.quantity - 1)} title="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <strong>{item.quantity}</strong>
                  <button type="button" disabled={busyItemId === item.id || item.quantity >= Number(item.variant.stockQuantity || 0)} onClick={() => updateQuantity(item, item.quantity + 1)} title="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="cart-item-total">
                  <strong>{money(item.lineTotal)}</strong>
                  <small>{money(item.unitPrice)} each</small>
                </div>
                <button className="icon-button danger-button" type="button" disabled={busyItemId === item.id} onClick={() => removeItem(item)} title="Remove item">
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-card order-summary">
            <ShoppingBag size={24} />
            <h2>Order summary</h2>
            <div className="summary-line"><span>Items</span><strong>{cart.summary.itemCount}</strong></div>
            <div className="summary-line"><span>Total quantity</span><strong>{cart.summary.totalQuantity}</strong></div>
            <div className="summary-line total"><span>Subtotal</span><strong>{money(cart.summary.subtotal)}</strong></div>
            <button type="button" className="checkout-button" onClick={() => navigate("/checkout")}>Checkout</button>
            <button type="button" className="text-button" disabled={busyItemId === "clear"} onClick={clearCart}>Clear cart</button>
          </aside>
        </div>
      ) : (
        <div className="simple-panel empty-state">
          <ShoppingBag size={30} />
          <h2>Your cart is empty</h2>
          <p className="muted">Add a product variant to cart, then return here to test checkout.</p>
          <Link className="button-link" to="/">Browse products</Link>
        </div>
      )}
    </section>
  );
}

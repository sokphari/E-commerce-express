import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import QuantityStepper from "../components/QuantityStepper";
import { api } from "../api/client";
import { money } from "../lib/format";

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
      <PageHeader
        eyebrow="Shopping cart"
        title="Review your items"
        actions={<Button variant="secondary" to="/">Continue shopping</Button>}
      />

      {message ? <Notice>{message}</Notice> : null}

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
                <QuantityStepper
                  value={item.quantity}
                  disabled={busyItemId === item.id}
                  decreaseDisabled={item.quantity <= 1}
                  increaseDisabled={item.quantity >= Number(item.variant.stockQuantity || 0)}
                  onDecrease={() => updateQuantity(item, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item, item.quantity + 1)}
                />
                <div className="cart-item-total">
                  <strong>{money(item.lineTotal)}</strong>
                  <small>{money(item.unitPrice)} each</small>
                </div>
                <button
                  className="icon-button text-danger transition hover:bg-danger-bg"
                  type="button"
                  disabled={busyItemId === item.id}
                  onClick={() => removeItem(item)}
                  title="Remove item"
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-card order-summary">
            <ShoppingBag size={24} className="text-brand" />
            <h2>Order summary</h2>
            <div className="summary-line"><span>Items</span><strong>{cart.summary.itemCount}</strong></div>
            <div className="summary-line"><span>Total quantity</span><strong>{cart.summary.totalQuantity}</strong></div>
            <div className="summary-line total"><span>Subtotal</span><strong>{money(cart.summary.subtotal)}</strong></div>
            <Button fullWidth onClick={() => navigate("/checkout")}>Checkout</Button>
            <Button variant="ghost" disabled={busyItemId === "clear"} onClick={clearCart}>Clear cart</Button>
          </aside>
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag size={30} />}
          title="Your cart is empty"
          description="Add a product variant to cart, then return here to test checkout."
        >
          <Button to="/">Browse products</Button>
        </EmptyState>
      )}
    </section>
  );
}
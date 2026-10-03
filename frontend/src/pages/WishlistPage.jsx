import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { api } from "../api/client";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState("");

  useEffect(() => {
    let active = true;

    api.getWishlist()
      .then((response) => {
        if (!active) return;
        setItems(response.data || []);
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

  async function removeItem(productId) {
    try {
      setBusyProductId(productId);
      await api.removeFromWishlist(productId);
      setItems((current) => current.filter((item) => item.productId !== productId));
      setMessage("Product removed from wishlist.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyProductId("");
    }
  }

  return (
    <section className="cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Saved products</p>
          <h1>Wishlist</h1>
        </div>
        <Link className="button-link secondary-link" to="/">Continue shopping</Link>
      </div>

      {message ? <p className="notice">{message}</p> : null}

      {loading ? (
        <div className="product-grid">{Array.from({ length: 3 }).map((_, index) => <div className="skeleton" key={index} />)}</div>
      ) : items.length ? (
        <div className="product-grid">
          {items.map((item) => (
            <article className="product-card" key={item.id}>
              <Link className="product-image no-underline" to={`/products/${item.product.slug}`} aria-label={item.product.name}>
                <span>{item.product.name?.slice(0, 2).toUpperCase()}</span>
              </Link>
              <div className="product-body">
                <div className="product-meta">
                  <span>{item.product.brand?.name || "PhoneHub"}</span>
                  <span>{item.product.category?.name || "Catalog"}</span>
                </div>
                <h2>{item.product.name}</h2>
                <p>{item.product.shortDescription || "Saved for later."}</p>
                <div className="product-footer">
                  <strong>{money(item.product.basePrice)}</strong>
                  <button className="icon-button danger-button" type="button" disabled={busyProductId === item.productId} onClick={() => removeItem(item.productId)} title="Remove from wishlist">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="simple-panel empty-state">
          <Heart size={30} />
          <h2>Your wishlist is empty</h2>
          <p className="muted">Save products you like, then return here when you are ready to buy.</p>
          <Link className="button-link" to="/"><ShoppingBag size={18} /> Browse products</Link>
        </div>
      )}
    </section>
  );
}

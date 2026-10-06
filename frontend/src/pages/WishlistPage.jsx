import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import ProductThumb from "../components/ProductThumb";
import { api } from "../api/client";
import { money } from "../lib/format";

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
      <PageHeader
        eyebrow="Saved products"
        title="Wishlist"
        actions={<Button variant="secondary" to="/">Continue shopping</Button>}
      />

      {message ? <Notice>{message}</Notice> : null}

      {loading ? (
        <div className="product-grid">{Array.from({ length: 3 }).map((_, index) => <div className="skeleton" key={index} />)}</div>
      ) : items.length ? (
        <div className="product-grid">
          {items.map((item) => (
            <article className="product-card" key={item.id}>
              <ProductThumb name={item.product.name} to={`/products/${item.product.slug}`} ariaLabel={item.product.name} />
              <div className="product-body">
                <div className="product-meta">
                  <span>{item.product.brand?.name || "PhoneHub"}</span>
                  <span>{item.product.category?.name || "Catalog"}</span>
                </div>
                <h2>{item.product.name}</h2>
                <p>{item.product.shortDescription || "Saved for later."}</p>
                <div className="product-footer">
                  <strong>{money(item.product.basePrice)}</strong>
                  <button
                    className="icon-button text-danger transition hover:bg-danger-bg"
                    type="button"
                    disabled={busyProductId === item.productId}
                    onClick={() => removeItem(item.productId)}
                    title="Remove from wishlist"
                    aria-label={`Remove ${item.product.name} from wishlist`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={30} />}
          title="Your wishlist is empty"
          description="Save products you like, then return here when you are ready to buy."
        >
          <Button to="/"><ShoppingBag size={18} /> Browse products</Button>
        </EmptyState>
      )}
    </section>
  );
}
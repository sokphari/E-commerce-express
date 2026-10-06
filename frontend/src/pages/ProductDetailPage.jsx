import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import Button from "../components/Button";
import Notice from "../components/Notice";
import StarRating from "../components/StarRating";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";
import { money } from "../lib/format";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [message, setMessage] = useState("");
  const [reviewsMessage, setReviewsMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadProduct() {
      try {
        const response = await api.getProduct(slug);
        const nextProduct = response.data.product || response.data;
        if (!alive) return;
        setProduct(nextProduct);
        setSelectedVariantId(nextProduct.variants?.[0]?.id || "");
        setMessage("");

        if (nextProduct.id && !String(nextProduct.id).startsWith("demo-")) {
          api.getProductReviews(nextProduct.id)
            .then((reviewResponse) => {
              if (!alive) return;
              setReviews(reviewResponse.data || []);
              setReviewsMessage("");
            })
            .catch((error) => {
              if (!alive) return;
              setReviews([]);
              setReviewsMessage(error.message);
            });
        }
      } catch {
        const fallback = fallbackProducts.find((item) => item.slug === slug) || fallbackProducts[0];
        if (!alive) return;
        setProduct(fallback);
        setReviews([]);
        setMessage("Backend product detail is not reachable, showing demo detail.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      alive = false;
    };
  }, [slug]);

  const variants = useMemo(() => product?.variants || [], [product]);
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  async function addToWishlist() {
    if (!product?.id || String(product.id).startsWith("demo-")) {
      setMessage("Wishlist needs a real backend product.");
      return;
    }

    try {
      await api.addToWishlist(product.id);
      setMessage("Added to wishlist.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addToCart() {
    if (!selectedVariant?.id) {
      setMessage("This product does not have a selectable variant yet.");
      return;
    }

    try {
      await api.addToCart({ productVariantId: selectedVariant.id, quantity: 1 });
      setMessage("Added to cart.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (loading) {
    return <section className="detail-page"><div className="detail-panel skeleton" /></section>;
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/"><ArrowLeft size={16} /> Back to shop</Link>
      {message && <Notice>{message}</Notice>}

      <div className="detail-panel">
        <div className="detail-visual" aria-hidden="true">
          <span>{product.name?.slice(0, 2).toUpperCase()}</span>
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.brand?.name || "PhoneHub"} / {product.category?.name || "Catalog"}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description || product.shortDescription || "Product detail ready for backend connection."}</p>
          <strong className="price">{money(selectedVariant?.salePrice || selectedVariant?.price || product.minEffectivePrice || product.basePrice)}</strong>

          <div className="variant-list">
            {variants.length ? variants.map((variant) => (
              <button
                type="button"
                className={variant.id === selectedVariantId ? "variant-option active" : "variant-option"}
                key={variant.id}
                onClick={() => setSelectedVariantId(variant.id)}
              >
                <span>{[variant.color, variant.storage, variant.ram].filter(Boolean).join(" / ") || variant.sku}</span>
                <small>{Number(variant.stockQuantity || 0)} stock</small>
              </button>
            )) : <p className="muted">Variants will appear here when backend data includes them.</p>}
          </div>

          <div className="detail-actions">
            <Button type="button" onClick={addToCart}><ShoppingCart size={18} /> Add to cart</Button>
            <Button type="button" variant="secondary" onClick={addToWishlist}><Heart size={18} /> Wishlist</Button>
          </div>
        </div>
      </div>

      <section className="review-section">
        <div className="review-header">
          <div>
            <p className="eyebrow">Customer feedback</p>
            <h2>Reviews</h2>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-warning-bg px-4 py-2 font-extrabold text-warning-ink">
            <Star size={18} fill="currentColor" />
            <strong>{reviews.length ? averageRating.toFixed(1) : "-"}</strong>
            <span>{reviews.length} reviews</span>
          </div>
        </div>

        {reviewsMessage ? <Notice tone="danger">{reviewsMessage}</Notice> : null}

        {reviews.length ? (
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <StarRating value={review.rating} size={16} />
                <p>{review.comment || "No comment."}</p>
                <small>{review.user ? review.user.firstName + " " + review.user.lastName : "Customer"}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className="review-empty">
            <Star size={24} />
            <p className="muted">No approved reviews yet.</p>
          </div>
        )}
      </section>
    </section>
  );
}
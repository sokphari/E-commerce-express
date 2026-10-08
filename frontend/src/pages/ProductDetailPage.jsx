import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Camera, Cpu, Gift, Heart, MemoryStick, Radio, ShoppingCart, Smartphone, Speaker, Star, SwatchBook } from "lucide-react";
import Button from "../components/Button";
import Notice from "../components/Notice";
import StarRating from "../components/StarRating";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";
import { money } from "../lib/format";

function getColorValue(color) {
  const normalized = String(color || "").toLowerCase();
  const map = {
    black: "#111827",
    white: "#f8fafc",
    silver: "#cbd5e1",
    blue: "#2563eb",
    navy: "#172554",
    red: "#dc2626",
    purple: "#8b5cf6",
    gold: "#d97706",
    starlight: "#f5efe6",
    ultramarine: "#3b82f6",
    aqua: "#14b8a6",
  };

  const matched = Object.keys(map).find((key) => normalized.includes(key));
  return matched ? map[matched] : "#0f766e";
}

function getSpecValue(product, variant, keys, fallback = "Not specified") {
  const specs = product?.specifications || product?.specs || [];
  const normalizedKeys = keys.map((key) => key.toLowerCase());

  if (Array.isArray(specs)) {
    const matched = specs.find((spec) => normalizedKeys.includes(String(spec.key || spec.specKey || "").toLowerCase()));
    if (matched) return matched.value || matched.specValue || fallback;
  }

  if (specs && typeof specs === "object" && !Array.isArray(specs)) {
    const matchedKey = Object.keys(specs).find((key) => normalizedKeys.includes(key.toLowerCase()));
    if (matchedKey) return specs[matchedKey] || fallback;
  }

  const fieldMap = {
    color: variant?.color,
    memory: [variant?.storage, variant?.ram].filter(Boolean).join(" / "),
    model: product?.name,
  };

  const fieldKey = normalizedKeys.find((key) => fieldMap[key]);
  return fieldKey ? fieldMap[fieldKey] : fallback;
}

function getFreeGiftOptions(product, variant) {
  const value = getSpecValue(product, variant, ["gift", "bonus", "promotion"], "");
  if (value) return String(value).split(",").map((item) => item.trim()).filter(Boolean);

  const category = product?.category?.name?.toLowerCase() || "";
  if (category.includes("accessories")) return ["Cable organizer", "Warranty card"];
  if (category.includes("watch")) return ["Watch strap", "Screen protector"];
  return ["Black case", "Fast charging cable", "Screen protector"];
}

function SpecItem({ icon, label, value }) {
  return (
    <div className="spec-item">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value || "Not specified"}</strong>
      </div>
    </div>
  );
}

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
  const colorOptions = useMemo(() => {
    const colors = variants
      .filter((variant) => variant.color)
      .map((variant) => ({ color: variant.color, variantId: variant.id, stockQuantity: variant.stockQuantity }));

    return colors.filter((item, index, all) => all.findIndex((next) => next.color === item.color) === index);
  }, [variants]);
  const giftOptions = useMemo(() => getFreeGiftOptions(product, selectedVariant), [product, selectedVariant]);
  const specItems = [
    { label: "Model", value: getSpecValue(product, selectedVariant, ["model", "name"], product?.name), icon: <Smartphone size={18} /> },
    { label: "Color", value: getSpecValue(product, selectedVariant, ["color"]), icon: <SwatchBook size={18} /> },
    { label: "Gift", value: getSpecValue(product, selectedVariant, ["gift", "bonus", "promotion"]), icon: <Gift size={18} /> },
    { label: "CPU", value: getSpecValue(product, selectedVariant, ["cpu", "chip", "processor"]), icon: <Cpu size={18} /> },
    { label: "Battery", value: getSpecValue(product, selectedVariant, ["battery"]), icon: <BatteryCharging size={18} /> },
    { label: "Sound", value: getSpecValue(product, selectedVariant, ["sound", "speaker", "audio"]), icon: <Speaker size={18} /> },
    { label: "Selfie camera", value: getSpecValue(product, selectedVariant, ["selfie camera", "front camera", "selfie"]), icon: <Camera size={18} /> },
    { label: "Comms", value: getSpecValue(product, selectedVariant, ["comms", "connectivity", "network"]), icon: <Radio size={18} /> },
    { label: "Memory", value: getSpecValue(product, selectedVariant, ["memory", "storage", "ram"]), icon: <MemoryStick size={18} /> },
  ];
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

          {colorOptions.length ? (
            <section className="choice-section" aria-label="Choose color">
              <div className="choice-heading">
                <strong>Color</strong>
                <span>{selectedVariant?.color || "Choose color"}</span>
              </div>
              <div className="color-choice-list">
                {colorOptions.map((item) => (
                  <button
                    className={selectedVariant?.color === item.color ? "color-choice active" : "color-choice"}
                    type="button"
                    key={item.color}
                    onClick={() => setSelectedVariantId(item.variantId)}
                  >
                    <span style={{ backgroundColor: getColorValue(item.color) }} />
                    {item.color}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {giftOptions.length ? (
            <section className="choice-section" aria-label="Free gift">
              <div className="choice-heading">
                <strong>Free gift</strong>
                <span>Included with this product</span>
              </div>
              <div className="gift-list">
                {giftOptions.map((gift) => <span key={gift}><Gift size={16} /> {gift}</span>)}
              </div>
            </section>
          ) : null}

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

          <section className="detail-specs" aria-label="Product specifications">
            <div className="section-heading"><Cpu size={20} className="text-brand" /><h2>Product details</h2></div>
            <div className="spec-grid">
              {specItems.map((item) => <SpecItem icon={item.icon} label={item.label} value={item.value} key={item.label} />)}
            </div>
          </section>

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
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [message, setMessage] = useState("");
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
      } catch {
        const fallback = fallbackProducts.find((item) => item.slug === slug) || fallbackProducts[0];
        if (!alive) return;
        setProduct(fallback);
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
      {message && <p className="notice">{message}</p>}

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
            <button type="button" onClick={addToCart}><ShoppingCart size={18} /> Add to cart</button>
            <button type="button" className="secondary"><Heart size={18} /> Wishlist</button>
          </div>
        </div>
      </div>
    </section>
  );
}

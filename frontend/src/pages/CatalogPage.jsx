import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, RefreshCcw, Search } from "lucide-react";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  async function loadProducts(query = "", options = {}) {
    try {
      if (options.showLoading !== false) {
        setStatus("loading");
      }
      const response = await api.getProducts(query ? `?search=${encodeURIComponent(query)}` : "");
      setProducts(response.data || []);
      setStatus("ready");
      setMessage("");
    } catch {
      setProducts(fallbackProducts);
      setStatus("fallback");
      setMessage("Backend is not reachable, showing demo products.");
    }
  }

  useEffect(() => {
    let active = true;

    api.getProducts("")
      .then((response) => {
        if (!active) return;
        setProducts(response.data || []);
        setStatus("ready");
        setMessage("");
      })
      .catch(() => {
        if (!active) return;
        setProducts(fallbackProducts);
        setStatus("fallback");
        setMessage("Backend is not reachable, showing demo products.");
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleProducts = useMemo(() => products, [products]);

  function handleSubmit(event) {
    event.preventDefault();
    loadProducts(search.trim());
  }

  return (
    <section className="catalog-page">
      <div className="catalog-header">
        <div>
          <p className="eyebrow">PhoneHub storefront</p>
          <h1>Browse phones and accessories</h1>
          <p className="lede">Connect this frontend to your backend API and start testing the real customer shopping flow.</p>
        </div>
        <form className="search-panel" onSubmit={handleSubmit}>
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search iPhone, Samsung, charger"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="toolbar">
        <span><Filter size={16} /> {visibleProducts.length} products</span>
        <button type="button" onClick={() => loadProducts(search.trim())}>
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {message && <p className="notice">{message}</p>}

      <div className="product-grid" aria-live="polite">
        {status === "loading" ? (
          Array.from({ length: 6 }).map((_, index) => <div className="product-card skeleton" key={index} />)
        ) : (
          visibleProducts.map((product) => (
            <Link className="product-card" to={`/products/${product.slug}`} key={product.id}>
              <div className="product-image" aria-hidden="true">
                <span>{product.name?.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="product-body">
                <div className="product-meta">
                  <span>{product.brand?.name || "PhoneHub"}</span>
                  <span>{product.category?.name || "Catalog"}</span>
                </div>
                <h2>{product.name}</h2>
                <p>{product.shortDescription || product.description || "Ready for product detail testing."}</p>
                <div className="product-footer">
                  <strong>{money(product.minEffectivePrice || product.basePrice)}</strong>
                  <span>{Number(product.totalStockQuantity || 0)} stock</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

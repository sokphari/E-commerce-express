import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Filter, RefreshCcw, Search } from "lucide-react";
import Button from "../components/Button";
import Notice from "../components/Notice";
import ProductThumb from "../components/ProductThumb";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";
import { money } from "../lib/format";

export default function CatalogPage() {
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location]);

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
            ref={searchInputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search iPhone, Samsung, charger"
            aria-label="Search products"
          />
          <Button type="submit" aria-label="Search products">Search</Button>
        </form>
      </div>

      <div className="toolbar">
        <span><Filter size={16} /> {visibleProducts.length} products</span>
        <Button variant="secondary" onClick={() => loadProducts(search.trim())}><RefreshCcw size={16} /> Refresh</Button>
      </div>

      {message && <Notice>{message}</Notice>}

      <div className="product-grid" aria-live="polite">
        {status === "loading" ? (
          Array.from({ length: 6 }).map((_, index) => <div className="product-card skeleton" key={index} />)
        ) : (
          visibleProducts.map((product) => (
            <Link className="product-card" to={`/products/${product.slug}`} key={product.id}>
              <ProductThumb name={product.name} />
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, Headphones, Search, ShieldCheck, Smartphone } from "lucide-react";
import Notice from "../components/Notice";
import ProductThumb from "../components/ProductThumb";
import { api } from "../api/client";
import { fallbackProducts } from "../data/fallbackProducts";
import { money } from "../lib/format";
import carouselPhones from "../assets/carousel-phones.svg";
import carouselAccessories from "../assets/carousel-accessories.svg";
import carouselShopping from "../assets/carousel-shopping.svg";

const heroSlides = [
  {
    eyebrow: "New arrival",
    title: "Smartphones for every customer",
    description: "Feature your latest phones, variants, and stock from the backend catalog.",
    action: "Shop phones",
    search: "phone",
    image: carouselPhones,
  },
  {
    eyebrow: "Accessories",
    title: "Cases, chargers, earbuds",
    description: "Help customers discover add-ons that fit their daily setup.",
    action: "Shop accessories",
    search: "accessories",
    image: carouselAccessories,
  },
  {
    eyebrow: "Trusted store",
    title: "Wishlist, checkout, and orders",
    description: "Test the full customer flow from product browsing to order tracking.",
    action: "Browse products",
    search: "",
    image: carouselShopping,
  },
];

const brandLogos = [
  { name: "Apple", className: "brand-apple" },
  { name: "Samsung", className: "brand-samsung" },
  { name: "OPPO", className: "brand-oppo" },
  { name: "vivo", className: "brand-vivo" },
  { name: "HUAWEI", className: "brand-huawei" },
  { name: "realme", className: "brand-realme" },
  { name: "HONOR", className: "brand-honor" },
  { name: "NOKIA", className: "brand-nokia" },
  { name: "TECNO", className: "brand-tecno" },
  { name: "Infinix", className: "brand-infinix" },
  { name: "Xiaomi", className: "brand-xiaomi" },
  { name: "Black Shark", className: "brand-blackshark" },
  { name: "Nillkin", className: "brand-nillkin" },
  { name: "COTECi", className: "brand-coteci" },
  { name: "alnastyle", className: "brand-alnastyle" },
  { name: "hoco.", className: "brand-hoco" },
  { name: "XUNDD", className: "brand-xundd" },
  { name: "ANKER", className: "brand-anker" },
  { name: "DJI", className: "brand-dji" },
  { name: "SONY", className: "brand-sony" },
  { name: "JBL", className: "brand-jbl" },
  { name: "Marshall", className: "brand-marshall" },
  { name: "HIKSEMI", className: "brand-hiksemi" },
];

const staticBanners = [
  {
    title: "Latest phones",
    description: "Browse new Apple, Samsung, and Android devices ready for your store catalog.",
    label: "Phones",
    icon: Smartphone,
  },
  {
    title: "Accessories",
    description: "Promote chargers, cases, earbuds, and useful add-ons beside every device.",
    label: "Add-ons",
    icon: Headphones,
  },
  {
    title: "Secure shopping",
    description: "Customers can save wishlist items, checkout, and track orders after login.",
    label: "Customer flow",
    icon: ShieldCheck,
  },
];

function sectionTitleParts(title) {
  const words = title.split(" ");
  const accent = words.pop();
  return { lead: words.join(" "), accent };
}

function getProductPrice(product) {
  return product.minEffectivePrice || product.basePrice;
}

function ProductShowcaseCard({ product }) {
  return (
    <Link className="showcase-card" to={`/products/${product.slug}`}>
      <ProductThumb name={product.name} className="showcase-thumb" />
      <strong className="showcase-price">{money(getProductPrice(product))}</strong>
      <h3>{product.name}</h3>
      <span>View product</span>
    </Link>
  );
}

function ProductSection({ title, description, products, compact = false }) {
  const scrollerRef = useRef(null);

  if (!products.length) return null;
  const parts = sectionTitleParts(title);

  function scrollProducts(direction) {
    if (!scrollerRef.current) return;

    const element = scrollerRef.current;
    const firstCard = element.querySelector(".showcase-card");
    if (!firstCard) return;

    const styles = window.getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, element.scrollLeft + direction * step));
    const start = element.scrollLeft;
    const distance = target - start;
    const duration = 420;
    const startedAt = performance.now();

    function animate(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      element.scrollLeft = start + distance * eased;

      if (progress < 1) window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
  }

  return (
    <section className={compact ? "product-showcase compact" : "product-showcase"}>
      <div className="showcase-heading">
        <div>
          <h2><span>{parts.lead}</span> {parts.accent}</h2>
          <p>{description}</p>
        </div>
        <div className="showcase-controls" aria-label={title + " controls"}>
          <button type="button" aria-label="Previous products" onClick={() => scrollProducts(-1)}><ChevronLeft size={18} /></button>
          <button type="button" aria-label="Next products" onClick={() => scrollProducts(1)}><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="showcase-scroll" ref={scrollerRef} tabIndex={0} aria-label={title + " product list"}>
        {products.map((product) => <ProductShowcaseCard product={product} key={product.id} />)}
      </div>
      {compact && products.length >= 8 ? <button className="view-more-link" type="button">View more</button> : null}
    </section>
  );
}

export default function CatalogPage() {
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.state?.brandId) {
      setSearch(location.state.searchLabel || "");
      loadProducts("", { brandId: location.state.brandId, showLoading: false });
    } else if (location.state?.search) {
      setSearch(location.state.search);
      loadProducts(location.state.search, { showLoading: false });
    }

    if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location]);

  async function loadProducts(query = "", options = {}) {
    try {
      if (options.showLoading !== false) {
        setStatus("loading");
      }
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (options.brandId) params.set("brandId", options.brandId);
      const queryString = params.toString();
      const response = await api.getProducts(queryString ? `?${queryString}` : "");
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
  const featuredProducts = useMemo(() => {
    const featured = visibleProducts.filter((product) => product.isFeatured);
    return (featured.length ? featured : visibleProducts).slice(0, 16);
  }, [visibleProducts]);
  const productSections = useMemo(() => {
    const groups = new Map();

    visibleProducts.forEach((product) => {
      const key = product.brand?.name || product.category?.name;
      if (!key) return;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(product);
    });

    return Array.from(groups.entries())
      .filter(([, groupProducts]) => groupProducts.length > 0)
      .slice(0, 4)
      .map(([name, groupProducts]) => ({
        name,
        products: groupProducts.slice(0, 8),
      }));
  }, [visibleProducts]);

  function handleSubmit(event) {
    event.preventDefault();
    loadProducts(search.trim());
  }

  return (
    <section className="catalog-page">
      <div className="catalog-header">
        <div>
          <p className="eyebrow">PhoneHub storefront</p>
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
          {/* Keep this button for future use if we want visible search submit again.
          <Button type="submit" aria-label="Search products">Search</Button>
          */}
        </form>
      </div>

      <section className="hero-carousel" aria-label="Store highlights">
        {heroSlides.map((slide, index) => (
          <article className={index === activeSlide ? "hero-slide active" : "hero-slide"} key={slide.title}>
            <div>
              <p className="eyebrow">{slide.eyebrow}</p>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <button
                type="button"
                onClick={() => {
                  setSearch(slide.search);
                  loadProducts(slide.search, { showLoading: false });
                }}
              >
                {slide.action}
              </button>
            </div>
<div className="hero-media">
              <img src={slide.image} alt="" aria-hidden="true" />
            </div>
          </article>
        ))}

        <div className="hero-controls">
          <button type="button" aria-label="Previous slide" onClick={() => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}>
            <ChevronLeft size={20} />
          </button>
          <div>
            {heroSlides.map((slide, index) => (
              <button
                className={index === activeSlide ? "active" : ""}
                type="button"
                aria-label={"Open slide " + (index + 1)}
                key={slide.title}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next slide" onClick={() => setActiveSlide((current) => (current + 1) % heroSlides.length)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section className="brand-strip" aria-label="Shop by brand">
        {brandLogos.map((brand) => (
          <button
            className={"brand-pill " + brand.className}
            type="button"
            key={brand.name}
            onClick={() => {
              setSearch(brand.name);
              loadProducts(brand.name, { showLoading: false });
            }}
          >
            {brand.name}
          </button>
        ))}
      </section>

      <div className="banner-grid" aria-label="Store promotions">
        {staticBanners.map((banner) => {
          const Icon = banner.icon;
          return (
            <article className="promo-banner" key={banner.title}>
              <span className="promo-banner-icon"><Icon size={24} /></span>
              <div>
                <small>{banner.label}</small>
                <h2>{banner.title}</h2>
                <p>{banner.description}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="toolbar">
        <span><Filter size={16} /> {visibleProducts.length} products</span>
      </div>

      {message && <Notice>{message}</Notice>}

      <div aria-live="polite">
        {status === "loading" ? (
          <div className="showcase-scroll">
            {Array.from({ length: 8 }).map((_, index) => <div className="showcase-card skeleton" key={index} />)}
          </div>
        ) : (
          <>
            <ProductSection
              title="Featured Products"
              description="Most popular products recommended to you"
              products={featuredProducts}
            />

            {productSections.map((section) => (
              <ProductSection
                compact
                title={section.name + " Products"}
                description="Most popular products recommended to you"
                products={section.products}
                key={section.name}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
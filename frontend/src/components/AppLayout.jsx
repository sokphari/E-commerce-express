import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ChevronDown, Heart, LogOut, Menu, Search, ShoppingBag, Smartphone, UserRound, X } from "lucide-react";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

function navItems(user) {
  const items = [
    { to: "/", label: "Home", end: true },
    { to: "/", label: "Brands", end: true, hasMenu: true, state: { focusSearch: true } },
    { to: "/", label: "Smartphone", end: true, hasMenu: true, state: { search: "phone" } },
    { to: "/", label: "Accessories", end: true, hasMenu: true, state: { search: "accessories" } },
  ];

  if (user) {
    items.push(
      { to: "/wishlist", label: "Wishlist", end: false },
      { to: "/orders", label: "Orders", end: false },
      { to: "/account", label: "Account", end: false }
    );
  }

  if (user?.role === "ADMIN") {
    items.push({ to: "/admin", label: "Admin", end: false });
  }

  return items;
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    let active = true;

    api.getBrands("?limit=30")
      .then((response) => {
        if (active) setBrands(response.data || []);
      })
      .catch(() => {
        if (active) setBrands([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const items = navItems(user);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><Smartphone size={22} /></span>
          <span className="hidden sm:inline">PhoneHub</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {items.map((item) => (
            item.label === "Brands" ? (
              <div className="nav-dropdown" key={item.label}>
                <Link className="nav-menu-link" to={item.to} state={item.state}>{item.label}<ChevronDown size={14} /></Link>
                {brands.length ? (
                  <div className="nav-dropdown-menu" role="menu" aria-label="Brand menu">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        to="/"
                        state={{ brandId: brand.id, searchLabel: brand.name }}
                        role="menuitem"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : item.hasMenu ? (
              <Link className="nav-menu-link" key={item.label} to={item.to} state={item.state}>{item.label}<ChevronDown size={14} /></Link>
            ) : (
              <NavLink key={item.label} to={item.to} end={item.end} state={item.state}>{item.label}</NavLink>
            )
          ))}
        </nav>

        <div className="top-actions">
          <button className="icon-button hidden sm:grid" type="button" title="Search disabled" aria-label="Search disabled" disabled>
            <Search size={18} />
          </button>
          <ThemeToggle />
          <Link className="icon-button" to="/cart" title="Open cart" aria-label="Open cart">
            <ShoppingBag size={18} />
          </Link>
          {user ? (
            <Link className="icon-button hidden sm:grid" to="/wishlist" title="Open wishlist" aria-label="Open wishlist">
              <Heart size={18} />
            </Link>
          ) : null}
          {user ? (
            <button className="icon-button hidden sm:grid" type="button" title="Logout" aria-label="Logout" onClick={logout}>
              <LogOut size={18} />
            </button>
          ) : (
            <Link className="icon-button hidden sm:grid" to="/login" title="Login" aria-label="Login">
              <UserRound size={18} />
            </Link>
          )}
          <button className="icon-button mobile-only" type="button" title="Menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div
            className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-full flex-col gap-6 overflow-y-auto border-l border-line bg-surface p-5 shadow-[var(--shadow-card)]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
                <span className="brand-mark-sm"><Smartphone size={20} /></span>
                <span>PhoneHub</span>
              </Link>
              <button className="icon-button" type="button" title="Close menu" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {items.map((item) => (
                item.label === "Brands" ? (
                  <div className="mobile-brand-group" key={item.label}>
                    <Link
                      to={item.to}
                      state={item.state}
                      onClick={closeMenu}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-bold text-ink-muted no-underline transition hover:bg-surface-muted hover:text-ink"
                    >
                      {item.label}<ChevronDown size={14} />
                    </Link>
                    {brands.slice(0, 12).map((brand) => (
                      <Link
                        key={brand.id}
                        to="/"
                        state={{ brandId: brand.id, searchLabel: brand.name }}
                        onClick={closeMenu}
                        className="rounded-lg px-6 py-2 text-sm font-bold text-ink-muted no-underline transition hover:bg-surface-muted hover:text-ink"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                ) : item.hasMenu ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    state={item.state}
                    onClick={closeMenu}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-bold text-ink-muted no-underline transition hover:bg-surface-muted hover:text-ink"
                  >
                    {item.label}<ChevronDown size={14} />
                  </Link>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.end}
                    state={item.state}
                    onClick={closeMenu}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-bold text-ink-muted no-underline transition hover:bg-surface-muted hover:text-ink"
                  >
                    {item.label}
                  </NavLink>
                )
              ))}
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 font-bold text-ink-muted opacity-60"
              >
                <Search size={18} /> Search disabled
              </button>
            </nav>
            <div className="grid gap-3">
              {user ? (
                <Button variant="secondary" onClick={logout}><LogOut size={18} /> Logout</Button>
              ) : (
                <Button to="/login"><UserRound size={18} /> Login</Button>
              )}
            </div>
          </div>
        </>
      ) : null}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
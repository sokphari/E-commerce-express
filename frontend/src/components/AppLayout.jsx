import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingBag, Smartphone, UserRound, X } from "lucide-react";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

function navItems(user) {
  const items = [
    { to: "/", label: "Shop", end: true },
    { to: "/cart", label: "Cart", end: false },
    { to: "/checkout", label: "Checkout", end: false },
  ];

  if (user) {
    items.push(
      { to: "/wishlist", label: "Wishlist", end: false },
      { to: "/orders", label: "Orders", end: false },
      { to: "/account", label: "Account", end: false }
    );
  }

  return items;
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const items = navItems(user);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><Smartphone size={22} /></span>
          <span>PhoneHub</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="top-actions">
          <Link className="icon-button" to="/" state={{ focusSearch: true }} title="Search products" aria-label="Search products">
            <Search size={18} />
          </Link>
          <ThemeToggle />
          <Link className="icon-button" to="/cart" title="Open cart" aria-label="Open cart">
            <ShoppingBag size={18} />
          </Link>
          {user ? (
            <Link className="icon-button" to="/wishlist" title="Open wishlist" aria-label="Open wishlist">
              <Heart size={18} />
            </Link>
          ) : null}
          {user ? (
            <button className="icon-button" type="button" title="Logout" aria-label="Logout" onClick={logout}>
              <LogOut size={18} />
            </button>
          ) : (
            <Link className="icon-button" to="/login" title="Login" aria-label="Login">
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
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2.5 font-bold text-ink-muted no-underline transition hover:bg-surface-muted hover:text-ink"
                >
                  {item.label}
                </NavLink>
              ))}
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
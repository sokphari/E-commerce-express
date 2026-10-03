import { Link, NavLink, Outlet } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingBag, Smartphone, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark"><Smartphone size={22} /></span>
          <span>PhoneHub</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
          {user ? <NavLink to="/wishlist">Wishlist</NavLink> : null}
          {user ? <NavLink to="/orders">Orders</NavLink> : null}
          {user ? <NavLink to="/account">Account</NavLink> : <NavLink to="/login">Login</NavLink>}
        </nav>

        <div className="top-actions">
          <button className="icon-button" type="button" title="Search products">
            <Search size={18} />
          </button>
          <Link className="icon-button" to="/cart" title="Open cart">
            <ShoppingBag size={18} />
          </Link>
          {user ? (
            <Link className="icon-button" to="/wishlist" title="Open wishlist">
              <Heart size={18} />
            </Link>
          ) : null}
          {user ? (
            <button className="icon-button" type="button" title="Logout" onClick={logout}>
              <LogOut size={18} />
            </button>
          ) : (
            <Link className="icon-button" to="/login" title="Login">
              <UserRound size={18} />
            </Link>
          )}
          <button className="icon-button mobile-only" type="button" title="Menu">
            <Menu size={18} />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

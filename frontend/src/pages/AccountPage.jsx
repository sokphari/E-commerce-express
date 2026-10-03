import { useEffect, useState } from "react";
import { Heart, Home, MapPin, PackageSearch, Plus, ShieldCheck, Star, Trash2, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const emptyAddress = {
  recipientName: "",
  phone: "",
  addressLine: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Cambodia",
  isDefault: true,
};

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value)) : "-";
}

export default function AccountPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyAddressId, setBusyAddressId] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.allSettled([api.getAddresses(), api.getOrders("?limit=3"), api.getWishlist()])
      .then(([addressResult, orderResult, wishlistResult]) => {
        if (!active) return;

        if (addressResult.status === "fulfilled") setAddresses(addressResult.value.data || []);
        if (orderResult.status === "fulfilled") setOrders(orderResult.value.data || []);
        if (wishlistResult.status === "fulfilled") setWishlist(wishlistResult.value.data || []);

        const failed = [addressResult, orderResult, wishlistResult].find((result) => result.status === "rejected");
        setMessage(failed ? failed.reason.message : "");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function createAddress(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.createAddress(form);
      const nextAddress = response.data.address;
      setAddresses((current) => [nextAddress, ...current.map((address) => nextAddress.isDefault ? { ...address, isDefault: false } : address)]);
      setForm(emptyAddress);
      setMessage("Address saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function setDefaultAddress(id) {
    try {
      setBusyAddressId(id);
      const response = await api.setDefaultAddress(id);
      const updated = response.data.address;
      setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === updated.id })));
      setMessage("Default address updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyAddressId("");
    }
  }

  async function deleteAddress(id) {
    try {
      setBusyAddressId(id);
      await api.deleteAddress(id);
      setAddresses((current) => current.filter((address) => address.id !== id));
      setMessage("Address deleted.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyAddressId("");
    }
  }

  if (!user) {
    return (
      <section className="simple-page">
        <div className="simple-panel">
          <UserRound size={28} />
          <h1>Account</h1>
          <p className="muted">Login to view profile, addresses, wishlist, and orders.</p>
          <Link className="button-link" to="/login">Login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="account-page">
      <div className="account-hero">
        <div>
          <p className="eyebrow">Account dashboard</p>
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="lede">{user.email}</p>
        </div>
        <div className="account-role-card">
          {user.role === "ADMIN" ? <ShieldCheck size={24} /> : <UserRound size={24} />}
          <span>{user.role}</span>
          <small>{user.status}</small>
        </div>
      </div>

      {message ? <p className="notice">{message}</p> : null}

      <div className="account-stats">
        <Link className="account-stat" to="/wishlist"><Heart size={22} /><span>Wishlist</span><strong>{wishlist.length}</strong></Link>
        <Link className="account-stat" to="/orders"><PackageSearch size={22} /><span>Orders</span><strong>{orders.length}</strong></Link>
        <a className="account-stat" href="#addresses"><MapPin size={22} /><span>Addresses</span><strong>{addresses.length}</strong></a>
      </div>

      {user.role === "ADMIN" ? (
        <div className="admin-note">
          <ShieldCheck size={20} />
          <div>
            <strong>Admin account detected</strong>
            <p className="muted">Customer account tools still work here. A dedicated admin dashboard should be built as a separate area next.</p>
          </div>
        </div>
      ) : null}

      <div className="account-grid">
        <section className="cart-card checkout-section" id="addresses">
          <div className="section-heading"><MapPin size={20} /><h2>Shipping addresses</h2></div>
          {loading ? <div className="skeleton" /> : addresses.length ? (
            <div className="address-list">
              {addresses.map((address) => (
                <article className={address.isDefault ? "address-card default" : "address-card"} key={address.id}>
                  <div>
                    <div className="address-card-title">
                      <strong>{address.recipientName}</strong>
                      {address.isDefault ? <span>Default</span> : null}
                    </div>
                    <p className="muted">{address.phone}</p>
                    <p>{address.addressLine}</p>
                    <p className="muted">{[address.city, address.province, address.postalCode, address.country].filter(Boolean).join(", ")}</p>
                  </div>
                  <div className="address-actions">
                    {!address.isDefault ? (
                      <button className="text-button" type="button" disabled={busyAddressId === address.id} onClick={() => setDefaultAddress(address.id)}>
                        <Star size={16} /> Set default
                      </button>
                    ) : null}
                    <button className="icon-button danger-button" type="button" disabled={busyAddressId === address.id} onClick={() => deleteAddress(address.id)} title="Delete address">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="muted">No saved addresses yet.</p>}
        </section>

        <section className="cart-card checkout-section">
          <div className="section-heading"><Plus size={20} /><h2>Add address</h2></div>
          <form className="address-form" onSubmit={createAddress}>
            <div className="form-grid">
              <label>Recipient<input value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} required /></label>
              <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></label>
            </div>
            <label>Address line<input value={form.addressLine} onChange={(event) => setForm({ ...form, addressLine: event.target.value })} required /></label>
            <div className="form-grid">
              <label>City<input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required /></label>
              <label>Province<input value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} /></label>
            </div>
            <div className="form-grid">
              <label>Postal code<input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} /></label>
              <label>Country<input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></label>
            </div>
            <label className="checkbox-label"><input checked={form.isDefault} onChange={(event) => setForm({ ...form, isDefault: event.target.checked })} type="checkbox" /> Use as default address</label>
            <button type="submit" disabled={saving}><Home size={18} /> Save address</button>
          </form>
        </section>

        <section className="cart-card checkout-section account-wide">
          <div className="section-heading"><PackageSearch size={20} /><h2>Recent orders</h2></div>
          {orders.length ? (
            <div className="summary-items">
              {orders.slice(0, 3).map((order) => (
                <Link className="recent-order" to={`/orders/${order.id}`} key={order.id}>
                  <span>
                    <strong>{order.orderNumber}</strong>
                    <small>{formatDate(order.createdAt)}</small>
                  </span>
                  <span className={`status-pill status-${order.orderStatus?.toLowerCase()}`}>{order.orderStatus}</span>
                  <strong>{money(order.totalAmount)}</strong>
                </Link>
              ))}
            </div>
          ) : <p className="muted">No orders yet.</p>}
        </section>
      </div>
    </section>
  );
}

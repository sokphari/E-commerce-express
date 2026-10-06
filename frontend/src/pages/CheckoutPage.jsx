import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin, Plus, ReceiptText } from "lucide-react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";
import { money } from "../lib/format";

const initialAddress = {
  recipientName: "",
  phone: "",
  addressLine: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Cambodia",
  isDefault: true,
};

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [notes, setNotes] = useState("");
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([api.getCart(), api.getAddresses()])
      .then(([cartResponse, addressResponse]) => {
        if (!active) return;
        const nextCart = cartResponse.data.cart;
        const nextAddresses = addressResponse.data || [];
        setCart(nextCart);
        setAddresses(nextAddresses);
        setSelectedAddressId(nextAddresses.find((address) => address.isDefault)?.id || nextAddresses[0]?.id || "");
        setMessage("");
      })
      .catch((error) => {
        if (!active) return;
        setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const hasItems = cart?.items?.length > 0;
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  async function createAddress(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.createAddress(addressForm);
      const nextAddress = response.data.address;
      setAddresses((current) => [nextAddress, ...current]);
      setSelectedAddressId(nextAddress.id);
      setAddressForm(initialAddress);
      setMessage("Address saved.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function placeOrder() {
    if (!selectedAddressId) {
      setMessage("Please select or create a shipping address.");
      return;
    }

    try {
      setSaving(true);
      const response = await api.checkout({ addressId: selectedAddressId, paymentMethod, notes: notes.trim() || undefined });
      setSuccess(response.data.order);
      setCart({ ...cart, items: [], summary: { itemCount: 0, totalQuantity: 0, subtotal: "0.00" } });
      setMessage("Checkout completed successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <section className="checkout-page">
        <div className="simple-panel success-panel">
          <CheckCircle2 size={34} className="text-success" />
          <p className="eyebrow">Order created</p>
          <h1>{success.orderNumber}</h1>
          <p className="muted">Your order is now saved in the backend.</p>
          <strong>{money(success.totalAmount)}</strong>
          <div className="success-actions">
            <Button to="/account">View account</Button>
            <Button variant="secondary" to="/">Continue shopping</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <PageHeader
        eyebrow="Checkout"
        title="Shipping and payment"
        actions={<Button variant="secondary" to="/cart">Back to cart</Button>}
      />

      {message ? <Notice>{message}</Notice> : null}

      {loading ? (
        <div className="checkout-layout"><div className="cart-card skeleton" /></div>
      ) : !hasItems ? (
        <EmptyState
          icon={<ReceiptText size={30} />}
          title="No items to checkout"
          description="Add products to your cart before checkout."
        >
          <Button to="/">Browse products</Button>
        </EmptyState>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-main">
            <section className="cart-card checkout-section">
              <div className="section-heading"><MapPin size={20} className="text-brand" /><h2>Shipping address</h2></div>
              {addresses.length ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <label className={address.id === selectedAddressId ? "address-option active" : "address-option"} key={address.id}>
                      <input type="radio" name="address" checked={address.id === selectedAddressId} onChange={() => setSelectedAddressId(address.id)} />
                      <span>
                        <strong>{address.recipientName}</strong>
                        <small>{address.phone}</small>
                        <small>{address.addressLine}, {address.city}{address.province ? ", " + address.province : ""}</small>
                      </span>
                    </label>
                  ))}
                </div>
              ) : <p className="muted">Create your first shipping address.</p>}

              <form className="address-form" onSubmit={createAddress}>
                <div className="section-heading"><Plus size={18} className="text-brand" /><h3>Add new address</h3></div>
                <div className="form-grid">
                  <label>Recipient<input value={addressForm.recipientName} onChange={(event) => setAddressForm({ ...addressForm, recipientName: event.target.value })} required /></label>
                  <label>Phone<input value={addressForm.phone} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} required /></label>
                </div>
                <label>Address line<input value={addressForm.addressLine} onChange={(event) => setAddressForm({ ...addressForm, addressLine: event.target.value })} required /></label>
                <div className="form-grid">
                  <label>City<input value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} required /></label>
                  <label>Province<input value={addressForm.province} onChange={(event) => setAddressForm({ ...addressForm, province: event.target.value })} /></label>
                </div>
                <Button type="submit" disabled={saving}><Plus size={18} /> Save address</Button>
              </form>
            </section>

            <section className="cart-card checkout-section">
              <h2>Payment method</h2>
              <div className="payment-options">
                {[
                  ["CASH_ON_DELIVERY", "Cash on delivery"],
                  ["MOCK_CARD", "Mock card"],
                  ["MOCK_QR", "Mock QR"],
                ].map(([value, label]) => (
                  <label className={paymentMethod === value ? "payment-option active" : "payment-option"} key={value}>
                    <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <label className="notes-field">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Delivery note, landmark, or customer request" /></label>
            </section>
          </div>

          <aside className="cart-card order-summary">
            <ReceiptText size={24} className="text-brand" />
            <h2>Checkout summary</h2>
            <div className="summary-items">
              {cart.items.map((item) => (
                <div className="summary-item" key={item.id}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <strong>{money(item.lineTotal)}</strong>
                </div>
              ))}
            </div>
            <div className="summary-line total"><span>Subtotal</span><strong>{money(cart.summary.subtotal)}</strong></div>
            {selectedAddress ? <p className="muted">Ship to {selectedAddress.city}</p> : null}
            <Button fullWidth disabled={saving || !selectedAddressId} onClick={placeOrder}>{saving ? "Processing" : "Place order"}</Button>
          </aside>
        </div>
      )}
    </section>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ReceiptText } from "lucide-react";
import { api } from "../api/client";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.getOrders()
      .then((response) => {
        if (!active) return;
        setOrders(response.data || []);
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

  return (
    <section className="cart-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Purchase history</p>
          <h1>Orders</h1>
        </div>
        <Link className="button-link secondary-link" to="/">Continue shopping</Link>
      </div>

      {message ? <p className="notice">{message}</p> : null}

      {loading ? (
        <div className="cart-card skeleton" />
      ) : orders.length ? (
        <div className="cart-card cart-items-panel">
          {orders.map((order) => (
            <Link className="order-row" to={`/orders/${order.id}`} key={order.id}>
              <div className="cart-item-image"><ReceiptText size={24} /></div>
              <div className="cart-item-copy">
                <h2>{order.orderNumber}</h2>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <span className={`status-pill status-${order.orderStatus?.toLowerCase()}`}>{order.orderStatus}</span>
              <span className={`status-pill status-${order.paymentStatus?.toLowerCase()}`}>{order.paymentStatus}</span>
              <strong>{money(order.totalAmount)}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <div className="simple-panel empty-state">
          <PackageSearch size={30} />
          <h2>No orders yet</h2>
          <p className="muted">When you checkout, your order history will appear here.</p>
          <Link className="button-link" to="/">Browse products</Link>
        </div>
      )}
    </section>
  );
}

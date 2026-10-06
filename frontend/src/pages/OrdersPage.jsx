import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ReceiptText } from "lucide-react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Notice from "../components/Notice";
import PageHeader from "../components/PageHeader";
import StatusPill from "../components/StatusPill";
import { api } from "../api/client";
import { formatDateTime, money } from "../lib/format";

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
      <PageHeader
        eyebrow="Purchase history"
        title="Orders"
        actions={<Button variant="secondary" to="/">Continue shopping</Button>}
      />

      {message ? <Notice>{message}</Notice> : null}

      {loading ? (
        <div className="cart-card skeleton" />
      ) : orders.length ? (
        <div className="cart-card cart-items-panel">
          {orders.map((order) => (
            <Link className="order-row" to={`/orders/${order.id}`} key={order.id}>
              <div className="cart-item-image"><ReceiptText size={24} /></div>
              <div className="cart-item-copy">
                <h2>{order.orderNumber}</h2>
                <p>{formatDateTime(order.createdAt)}</p>
              </div>
              <StatusPill status={order.orderStatus} />
              <StatusPill status={order.paymentStatus} />
              <strong>{money(order.totalAmount)}</strong>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PackageSearch size={30} />}
          title="No orders yet"
          description="When you checkout, your order history will appear here."
        >
          <Button to="/">Browse products</Button>
        </EmptyState>
      )}
    </section>
  );
}
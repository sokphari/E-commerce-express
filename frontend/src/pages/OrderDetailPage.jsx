import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Ban, PackageCheck, ReceiptText, Send, Star } from "lucide-react";
import { api } from "../api/client";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-";
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewingProductId, setReviewingProductId] = useState("");

  useEffect(() => {
    let active = true;

    api.getOrder(id)
      .then((response) => {
        if (!active) return;
        setOrder(response.data.order);
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
  }, [id]);

  function updateReviewDraft(productId, changes) {
    setReviewDrafts((current) => ({
      ...current,
      [productId]: {
        rating: current[productId]?.rating || 5,
        comment: current[productId]?.comment || "",
        ...changes,
      },
    }));
  }

  async function submitReview(item) {
    const draft = reviewDrafts[item.productId] || { rating: 5, comment: "" };

    try {
      setReviewingProductId(item.productId);
      await api.createReview(item.productId, {
        rating: draft.rating,
        comment: draft.comment.trim() || undefined,
      });
      setMessage("Review submitted. It is pending admin approval before it appears publicly.");
      setReviewDrafts((current) => ({
        ...current,
        [item.productId]: { rating: 5, comment: "" },
      }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReviewingProductId("");
    }
  }

  async function cancelOrder() {
    try {
      setSaving(true);
      const response = await api.cancelOrder(id);
      setOrder(response.data.order);
      setMessage("Order cancelled.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  const canCancel = order && ["PENDING", "CONFIRMED"].includes(order.orderStatus);
  const canReview = order?.orderStatus === "DELIVERED";

  return (
    <section className="checkout-page">
      <Link className="back-link" to="/orders"><ArrowLeft size={16} /> Back to orders</Link>
      {message ? <p className="notice">{message}</p> : null}

      {loading ? (
        <div className="cart-card skeleton" />
      ) : order ? (
        <div className="checkout-layout mt-6">
          <div className="checkout-main">
            <section className="cart-card checkout-section">
              <div className="section-heading"><PackageCheck size={22} /><h1>{order.orderNumber}</h1></div>
              <p className="muted">Created {formatDate(order.createdAt)}</p>
              <div className="flex flex-wrap gap-3">
                <span className={`status-pill status-${order.orderStatus?.toLowerCase()}`}>{order.orderStatus}</span>
                <span className={`status-pill status-${order.paymentStatus?.toLowerCase()}`}>{order.paymentStatus}</span>
              </div>
              {canCancel ? <button className="button-link danger-link" type="button" disabled={saving} onClick={cancelOrder}><Ban size={18} /> Cancel order</button> : null}
            </section>

            <section className="cart-card checkout-section">
              <h2>Items</h2>
              {canReview ? <p className="muted">This order is delivered, so you can review purchased products.</p> : <p className="muted">Review forms appear after this order is delivered.</p>}
              <div className="cart-items-panel">
                {order.items?.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-image" aria-hidden="true">{item.productName?.slice(0, 2).toUpperCase()}</div>
                    <div className="cart-item-copy">
                      <h2>{item.productName}</h2>
                      <p>{item.variantDescription || item.sku}</p>
                    </div>
                    <strong>x {item.quantity}</strong>
                    <div className="cart-item-total">
                      <strong>{money(item.lineTotal)}</strong>
                      <small>{money(item.unitPrice)} each</small>
                    </div>
                    {canReview ? (
                      <div className="review-form-row">
                        <div className="rating-picker" aria-label={"Review rating for " + item.productName}>
                          {Array.from({ length: 5 }).map((_, index) => {
                            const rating = index + 1;
                            const draft = reviewDrafts[item.productId] || { rating: 5, comment: "" };
                            return (
                              <button
                                type="button"
                                className={rating <= draft.rating ? "rating-button active" : "rating-button"}
                                key={rating}
                                onClick={() => updateReviewDraft(item.productId, { rating })}
                                title={rating + " stars"}
                              >
                                <Star size={16} fill="currentColor" />
                              </button>
                            );
                          })}
                        </div>
                        <textarea
                          value={(reviewDrafts[item.productId]?.comment) || ""}
                          onChange={(event) => updateReviewDraft(item.productId, { comment: event.target.value })}
                          rows={3}
                          placeholder="Share your experience with this product"
                        />
                        <button
                          className="button-link"
                          type="button"
                          disabled={reviewingProductId === item.productId}
                          onClick={() => submitReview(item)}
                        >
                          <Send size={16} /> Submit review
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="cart-card order-summary">
            <ReceiptText size={24} />
            <h2>Payment</h2>
            <div className="summary-line"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div>
            <div className="summary-line"><span>Shipping</span><strong>{money(order.shippingFee)}</strong></div>
            <div className="summary-line"><span>Tax</span><strong>{money(order.taxAmount)}</strong></div>
            <div className="summary-line total"><span>Total</span><strong>{money(order.totalAmount)}</strong></div>
            {order.payments?.map((payment) => (
              <div className="payment-note" key={payment.id}>
                <strong>{payment.paymentMethod}</strong>
                <span>{payment.status}</span>
              </div>
            ))}
          </aside>
        </div>
      ) : (
        <div className="simple-panel empty-state">
          <h2>Order not found</h2>
          <Link className="button-link" to="/orders">Back to orders</Link>
        </div>
      )}
    </section>
  );
}

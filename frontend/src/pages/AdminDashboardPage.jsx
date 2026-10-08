import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Boxes,
  ClipboardList,
  CreditCard,
  Home,
  LineChart,
  LogOut,
  PackageSearch,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Warehouse,
} from "lucide-react";
import { api } from "../api/client";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Notice from "../components/Notice";
import StatusPill from "../components/StatusPill";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { formatDateTime, money } from "../lib/format";

const adminRequests = {
  products: () => api.getAdminProducts("?limit=6"),
  variants: () => api.getAdminVariants("?limit=6"),
  orders: () => api.getAdminOrders("?limit=8"),
  payments: () => api.getAdminPayments("?limit=6"),
  inventory: () => api.getAdminInventoryMovements("?limit=6"),
  reviews: () => api.getAdminReviews("?limit=6"),
};

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: PackageSearch },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reports", label: "Reports", icon: LineChart },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

function getRows(result) {
  return result.status === "fulfilled" ? result.value.data || [] : [];
}

function getTotal(result, rows) {
  if (result.status !== "fulfilled") return rows.length;
  return result.value.pagination?.totalItems ?? result.value.pagination?.total ?? rows.length;
}

function StatCard({ icon, label, value, hint, href }) {
  const content = (
    <>
      <span className="admin-stat-icon">{icon}</span>
      <span className="admin-stat-copy">
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{hint}</em>
      </span>
    </>
  );

  if (href) return <a className="admin-stat-card" href={href}>{content}</a>;
  return <div className="admin-stat-card">{content}</div>;
}

function AdminPanel({ title, icon, children, id, action }) {
  return (
    <section className="admin-panel" id={id}>
      <div className="admin-panel-header">
        <div className="section-heading">{icon}<h2>{title}</h2></div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniSalesChart({ orders }) {
  const bars = orders.slice(0, 7).map((order) => Number(order.totalAmount || 0));
  const fallback = [30, 48, 40, 72, 58, 86, 64];
  const values = bars.length ? bars : fallback;
  const max = Math.max(...values, 1);

  return (
    <div className="admin-chart" aria-label="Sales chart">
      {values.map((value, index) => (
        <span key={index} style={{ height: String(Math.max(18, (value / max) * 100)) + "%" }}>
          <em>{money(value)}</em>
        </span>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState({
    products: [],
    variants: [],
    orders: [],
    payments: [],
    inventory: [],
    reviews: [],
    totals: {},
  });

  const canLoad = user?.role === "ADMIN";

  const loadDashboard = useCallback(async () => {
    if (!canLoad) return;
    const keys = Object.keys(adminRequests);
    const results = await Promise.allSettled(keys.map((key) => adminRequests[key]()));
    const next = { totals: {} };

    keys.forEach((key, index) => {
      const rows = getRows(results[index]);
      next[key] = rows;
      next.totals[key] = getTotal(results[index], rows);
    });

    const failed = results.filter((result) => result.status === "rejected");
    setDashboard(next);
    setMessage(failed.length ? failed.length + " admin area" + (failed.length > 1 ? "s" : "") + " could not load. Check backend routes or your token." : "");
    setLoading(false);
  }, [canLoad]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const revenue = dashboard.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const sales = dashboard.orders.reduce((sum, order) => sum + Number(order.items?.length || order.totalItems || 0), 0);
    const activeOrders = dashboard.orders.filter((order) => !["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.orderStatus));

    return { revenue, sales, activeOrders };
  }, [dashboard]);

  if (!user) {
    return (
      <section className="simple-page">
        <EmptyState
          icon={<ShieldCheck size={32} />}
          title="Admin dashboard"
          description="Login with an admin account to manage catalog, stock, orders, payments, and reviews."
        >
          <Button to="/login">Login</Button>
        </EmptyState>
      </section>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <section className="simple-page">
        <EmptyState
          icon={<ShieldCheck size={32} />}
          title="Admin access only"
          description="Your customer account is working, but this page is for staff users with the ADMIN role."
        >
          <Button to="/account" variant="secondary">Back to account</Button>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link className="admin-sidebar-brand" to="/admin">
          <span className="brand-mark-sm"><ShieldCheck size={20} /></span>
          <span>PhoneHub Admin</span>
        </Link>
        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <a className={item.id === "overview" ? "active" : ""} href={"#admin-" + item.id} key={item.id}>
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <button className="admin-sidebar-logout" type="button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1>Store overview</h1>
          </div>
          <div className="admin-topbar-actions">
            <button className="icon-button" type="button" title="Notifications" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <ThemeToggle />
            <Link className="admin-profile" to="/account" title="Admin profile" aria-label="Admin profile">
              <UserRound size={18} />
              <span>{user.firstName || "Admin"}</span>
            </Link>
          </div>
        </header>

        {message ? <Notice>{message}</Notice> : null}

        <div className="admin-content" id="admin-overview" aria-busy={loading}>
          <div className="admin-stat-grid">
            <StatCard href="#admin-users" icon={<Users size={22} />} label="Users" value="-" hint="Coming next" />
            <StatCard href="#admin-orders" icon={<ClipboardList size={22} />} label="Orders" value={dashboard.totals.orders ?? "-"} hint={String(stats.activeOrders.length) + " active"} />
            <StatCard href="#admin-reports" icon={<LineChart size={22} />} label="Revenue" value={money(stats.revenue)} hint="Recent loaded orders" />
            <StatCard href="#admin-products" icon={<Boxes size={22} />} label="Sales" value={stats.sales || dashboard.totals.variants || "-"} hint="Items/variants" />
          </div>

          <div className="admin-dashboard-grid">
            <AdminPanel id="admin-reports" title="Sales chart" icon={<LineChart size={20} className="text-brand" />}>
              <MiniSalesChart orders={dashboard.orders} />
            </AdminPanel>

            <AdminPanel
              id="admin-orders"
              title="Recent orders"
              icon={<ClipboardList size={20} className="text-brand" />}
              action={<Button type="button" variant="secondary" size="sm" onClick={loadDashboard} disabled={loading}><RefreshCw size={16} /> Refresh</Button>}
            >
              <div className="admin-list">
                {dashboard.orders.length ? dashboard.orders.map((order) => (
                  <Link className="admin-row" to={"/orders/" + order.id} key={order.id}>
                    <span className="admin-row-main">
                      <strong>{order.orderNumber || order.id}</strong>
                      <small>{formatDateTime(order.createdAt)}</small>
                    </span>
                    <StatusPill status={order.orderStatus} />
                    <strong>{money(order.totalAmount)}</strong>
                  </Link>
                )) : <p className="muted">No order records found.</p>}
              </div>
            </AdminPanel>
          </div>

          <div className="admin-operations-grid">
            <AdminPanel id="admin-users" title="Users" icon={<Users size={20} className="text-brand" />}>
              <p className="muted">User management will connect here after the user admin endpoints are added.</p>
            </AdminPanel>

            <AdminPanel id="admin-products" title="Products and variants" icon={<PackageSearch size={20} className="text-brand" />}>
              <div className="admin-workbench">
                {dashboard.products.map((product) => (
                  <article className="admin-action-card" key={product.id}>
                    <strong>{product.name}</strong>
                    <p className="muted">{product.brand?.name || "No brand"} - {product.category?.name || "No category"}</p>
                    <span>{money(product.minEffectivePrice ?? product.basePrice)}</span>
                  </article>
                ))}
                {dashboard.variants.map((variant) => (
                  <article className="admin-action-card" key={variant.id}>
                    <strong>{variant.sku || variant.name || "Variant"}</strong>
                    <p className="muted">{variant.product?.name || "Product variant"}</p>
                    <span>{Number(variant.stockQuantity ?? variant.stock ?? 0)} stock</span>
                  </article>
                ))}
                {!dashboard.products.length && !dashboard.variants.length ? <p className="muted">No catalog records found.</p> : null}
              </div>
            </AdminPanel>

            <AdminPanel id="admin-payments" title="Payments" icon={<CreditCard size={20} className="text-brand" />}>
              <div className="admin-list">
                {dashboard.payments.length ? dashboard.payments.map((payment) => (
                  <div className="admin-row" key={payment.id}>
                    <span className="admin-row-main">
                      <strong>{payment.provider || payment.paymentMethod || "Payment"}</strong>
                      <small>{payment.transactionId || payment.order?.orderNumber || formatDateTime(payment.createdAt)}</small>
                    </span>
                    <StatusPill status={payment.status} />
                    <strong>{money(payment.amount)}</strong>
                  </div>
                )) : <p className="muted">No payment records found.</p>}
              </div>
            </AdminPanel>

            <AdminPanel id="admin-notifications" title="Notifications and reviews" icon={<Bell size={20} className="text-brand" />}>
              <div className="admin-list">
                {dashboard.reviews.length ? dashboard.reviews.map((review) => (
                  <div className="admin-row" key={review.id}>
                    <span className="admin-row-main">
                      <strong>{review.title || review.product?.name || "Customer review"}</strong>
                      <small>{review.user?.email || String(review.rating || 0) + " star review"}</small>
                    </span>
                    <StatusPill status={review.status || "PUBLISHED"} />
                    <strong>{review.rating || "-"}/5</strong>
                  </div>
                )) : <p className="muted">No reviews found.</p>}
              </div>
            </AdminPanel>

            <AdminPanel id="admin-settings" title="Inventory and settings" icon={<Warehouse size={20} className="text-brand" />}>
              <div className="admin-list">
                {dashboard.inventory.length ? dashboard.inventory.map((movement) => (
                  <div className="admin-row" key={movement.id}>
                    <span className="admin-row-main">
                      <strong>{movement.type || movement.reason || "Stock movement"}</strong>
                      <small>{movement.variant?.sku || movement.productVariant?.sku || formatDateTime(movement.createdAt)}</small>
                    </span>
                    <StatusPill status={movement.type || movement.reason || "RECORDED"} />
                    <strong>{Number(movement.quantityChange ?? movement.quantity ?? 0)}</strong>
                  </div>
                )) : <p className="muted">No stock movement records found.</p>}
              </div>
            </AdminPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

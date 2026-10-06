const tones = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  confirmed: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  refunded: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

export default function StatusPill({ status }) {
  const key = String(status || "pending").toLowerCase();
  return <span className={`status-pill ${tones[key] || tones.pending}`}>{status}</span>;
}
import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-brand/60";

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3",
};

const variants = {
  primary: "bg-brand-solid text-brand-fg hover:bg-brand-solid-strong",
  secondary: "bg-surface-muted text-ink hover:bg-line",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-danger-solid text-white hover:bg-danger-solid-strong",
  dangerGhost: "bg-transparent text-danger hover:bg-danger-bg",
};

export default function Button({ to, href, variant = "primary", size = "md", fullWidth = false, className = "", ...props }) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  if (to) return <Link to={to} className={classes} {...props} />;
  if (href) return <a href={href} className={classes} {...props} />;
  return <button className={classes} {...props} />;
}
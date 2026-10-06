import { Link } from "react-router-dom";

export default function ProductThumb({ name, to, className = "", ariaLabel }) {
  const initials = name?.slice(0, 2).toUpperCase() || "PH";
  const classes = `product-image ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel || name}>
        <span>{initials}</span>
      </Link>
    );
  }

  return (
    <div className={classes} aria-hidden="true">
      <span>{initials}</span>
    </div>
  );
}
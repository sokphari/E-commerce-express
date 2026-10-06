export default function EmptyState({ icon, title, description, children, className = "" }) {
  return (
    <div className={`simple-panel empty-state ${className}`.trim()}>
      {icon ? <span className="flex justify-center text-ink-muted">{icon}</span> : null}
      <h2>{title}</h2>
      {description ? <p className="muted">{description}</p> : null}
      {children}
    </div>
  );
}
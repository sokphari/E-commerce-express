export default function TextField({ label, multiline = false, className = "", ...props }) {
  const classes =
    "w-full rounded-lg border border-line bg-surface px-3 py-3 text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-brand focus:ring-4 focus:ring-brand-ring";

  if (multiline) {
    return (
      <label className={`grid gap-2 font-bold text-ink-muted ${className}`.trim()}>
        {label}
        <textarea className={`${classes} resize-y`} {...props} />
      </label>
    );
  }

  return (
    <label className={`grid gap-2 font-bold text-ink-muted ${className}`.trim()}>
      {label}
      <input className={classes} {...props} />
    </label>
  );
}
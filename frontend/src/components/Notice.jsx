const tones = {
  info: "border-info/30 bg-info-bg text-info-ink",
  success: "border-success/30 bg-success-bg text-success-ink",
  danger: "border-danger/30 bg-danger-bg text-danger",
};

export default function Notice({ tone = "info", className = "", children }) {
  return <p className={`my-4 rounded-lg border px-4 py-3 ${tones[tone]} ${className}`.trim()}>{children}</p>;
}
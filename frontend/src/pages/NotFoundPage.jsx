import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="simple-page">
      <div className="simple-panel">
        <h1>Page not found</h1>
        <p className="muted">The page you opened does not exist.</p>
        <Link className="button-link" to="/">Back to shop</Link>
      </div>
    </section>
  );
}

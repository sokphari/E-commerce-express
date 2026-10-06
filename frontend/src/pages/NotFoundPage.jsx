import Button from "../components/Button";

export default function NotFoundPage() {
  return (
    <section className="simple-page">
      <div className="simple-panel">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you opened does not exist.</p>
        <Button to="/">Back to shop</Button>
      </div>
    </section>
  );
}
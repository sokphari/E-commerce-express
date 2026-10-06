import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import Button from "../components/Button";
import Notice from "../components/Notice";
import TextField from "../components/TextField";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Customer access</p>
        <h1>Login</h1>
        {error && <Notice tone="danger">{error}</Notice>}
        <TextField label="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required />
        <TextField label="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required />
        <Button type="submit" disabled={saving}><LogIn size={18} /> {saving ? "Logging in" : "Login"}</Button>
        <p className="form-footer">No account yet? <Link to="/register">Create one</Link></p>
      </form>
    </section>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await register(form);
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
        <p className="eyebrow">New customer</p>
        <h1>Create account</h1>
        {error && <p className="notice danger">{error}</p>}
        <div className="form-grid">
          <label>First name<input value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required /></label>
          <label>Last name<input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required /></label>
        </div>
        <label>Email<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" required /></label>
        <label>Password<input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" required minLength={8} /></label>
        <button type="submit" disabled={saving}><UserPlus size={18} /> {saving ? "Creating" : "Create account"}</button>
        <p className="form-footer">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}

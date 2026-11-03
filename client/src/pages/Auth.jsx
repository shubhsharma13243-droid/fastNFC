import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api";

export default function Auth({ mode }) {
  const signup = mode === "signup";
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { token } = await (signup ? api.signup(form) : api.login(form));
      setToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <form className="panel" onSubmit={submit}>
        <h1>{signup ? "Create your business page" : "Log in to your dashboard"}</h1>
        <p className="muted">
          {signup
            ? "One tap on your NFC tag opens your page with all your links."
            : "Edit your details, links and hours."}
        </p>
        {signup && (
          <label>
            Business name
            <input value={form.businessName} onChange={set("businessName")} placeholder="Sharma Sweets" required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={set("email")} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={set("password")} minLength={6} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>
          {busy ? "Please wait..." : signup ? "Create account" : "Log in"}
        </button>
        <p className="muted small">
          {signup ? (
            <>Already have an account? <Link to="/login">Log in</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </form>
    </main>
  );
}

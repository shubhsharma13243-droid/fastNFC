import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api, setToken } from "../api";

const LINK_FIELDS = [
  ["instagram", "Instagram", "https://instagram.com/yourshop"],
  ["facebook", "Facebook", "https://facebook.com/yourshop"],
  ["whatsapp", "WhatsApp number", "919876543210 (with country code)"],
  ["youtube", "YouTube", "https://youtube.com/@yourshop"],
  ["maps", "Google Maps location", "Paste the share link from Google Maps"],
  ["website", "Your own website (optional)", "https://yourshop.com"],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [b, setB] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.getMine().then(setB).catch(() => {
      setToken(null);
      navigate("/login");
    });
  }, []);

  if (!b) return <p className="center">Loading...</p>;

  const publicUrl = `${window.location.origin}/b/${b.slug}`;
  const flash = (text) => {
    setNote(text);
    setTimeout(() => setNote(""), 2500);
  };

  const setField = (key, value) => setB({ ...b, [key]: value });
  const setLink = (key, value) => setB({ ...b, links: { ...b.links, [key]: value } });
  const setHour = (i, time) => setField("hours", b.hours.map((h, n) => (n === i ? { ...h, time } : h)));
  const setService = (i, key, value) =>
    setField("services", b.services.map((s, n) => (n === i ? { ...s, [key]: value } : s)));

  async function save() {
    try {
      const { name, description, phone, hours, services, links } = b;
      const saved = await api.saveMine({
        name, description, phone, hours, links,
        services: services.filter((s) => s.name?.trim()),
      });
      setB(saved);
      flash("Changes saved");
    } catch (err) {
      flash(err.message);
    }
  }

  async function upload(field, file) {
    if (!file) return;
    const fd = new FormData();
    fd.append(field, file);
    try {
      const saved = await api.uploadImages(fd);
      // update only the images so unsaved text edits are not lost
      setB((prev) => ({ ...prev, logoUrl: saved.logoUrl, coverUrl: saved.coverUrl }));
    } catch (err) {
      flash(err.message);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    flash("Link copied");
  }

  function logout() {
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="dash">
      <header className="dash-top">
        <strong className="brand">fastNFC</strong>
        <div className="row">
          <Link className="btn ghost" to={`/b/${b.slug}`} target="_blank">View my page</Link>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="dash-grid">
        <div className="stack">
          <section className="panel">
            <h2>Business details</h2>
            <label>Business name
              <input value={b.name} onChange={(e) => setField("name", e.target.value)} />
            </label>
            <label>Description
              <textarea rows={3} value={b.description} onChange={(e) => setField("description", e.target.value)}
                placeholder="What you sell and what makes you different" />
            </label>
            <label>Phone number
              <input value={b.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" />
            </label>
          </section>

          <section className="panel">
            <h2>Logo and cover photo</h2>
            <div className="images">
              <label className="upload">
                {b.logoUrl ? <img src={b.logoUrl} alt="Logo" className="logo-prev" /> : <span>Add logo</span>}
                <input type="file" accept="image/*" hidden onChange={(e) => upload("logo", e.target.files[0])} />
              </label>
              <label className="upload wide">
                {b.coverUrl ? <img src={b.coverUrl} alt="Cover" /> : <span>Add cover photo</span>}
                <input type="file" accept="image/*" hidden onChange={(e) => upload("cover", e.target.files[0])} />
              </label>
            </div>
            <p className="muted small">PNG, JPG or WebP, up to 3 MB. Images upload as soon as you choose them.</p>
          </section>

          <section className="panel">
            <h2>Social and contact links</h2>
            {LINK_FIELDS.map(([key, label, placeholder]) => (
              <label key={key}>{label}
                <input value={b.links[key] || ""} placeholder={placeholder}
                  onChange={(e) => setLink(key, e.target.value)} />
              </label>
            ))}
          </section>

          <section className="panel">
            <h2>Services or menu</h2>
            {b.services.map((s, i) => (
              <div className="row" key={i}>
                <input value={s.name || ""} placeholder="Item or service" onChange={(e) => setService(i, "name", e.target.value)} />
                <input className="price" value={s.price || ""} placeholder="Price" onChange={(e) => setService(i, "price", e.target.value)} />
                <button className="btn ghost" onClick={() => setField("services", b.services.filter((_, n) => n !== i))}>Remove</button>
              </div>
            ))}
            <button className="btn ghost" onClick={() => setField("services", [...b.services, { name: "", price: "" }])}>
              Add an item
            </button>
          </section>

          <section className="panel">
            <h2>Business hours</h2>
            {b.hours.map((h, i) => (
              <label className="hour" key={h.day}>{h.day}
                <input value={h.time} onChange={(e) => setHour(i, e.target.value)} placeholder="9:00 AM - 6:00 PM, or Closed" />
              </label>
            ))}
          </section>
        </div>

        <aside className="side">
          <section className="panel">
            <h2>Your NFC and QR link</h2>
            <div className="qr"><QRCodeSVG value={publicUrl} size={168} /></div>
            <p className="link-box">{publicUrl}</p>
            <button className="btn" onClick={copyLink}>Copy link</button>
            <p className="muted small">Write this link to your NFC tag, and print the QR code as a backup.</p>
          </section>
        </aside>
      </div>

      <div className="savebar">
        <span>{note}</span>
        <button className="btn" onClick={save}>Save changes</button>
      </div>
    </div>
  );
}

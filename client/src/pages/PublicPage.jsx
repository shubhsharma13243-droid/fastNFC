import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, assetUrl } from "../api";

const withProtocol = (v) => (/^https?:\/\//.test(v) ? v : `https://${v}`);
const whatsapp = (v) => (/^https?:\/\//.test(v) ? v : `https://wa.me/${v.replace(/\D/g, "")}`);

export default function PublicPage() {
  const { slug } = useParams();
  const [b, setB] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.getPublic(slug).then((data) => {
      setB(data);
      document.title = data.name;
    }).catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <p className="center">We could not find this business.</p>;
  if (!b) return <p className="center">Loading...</p>;

  const l = b.links || {};
  const buttons = [
    b.phone && { label: "Call us", href: `tel:${b.phone.replace(/\s/g, "")}`, primary: true },
    l.whatsapp && { label: "Chat on WhatsApp", href: whatsapp(l.whatsapp) },
    l.instagram && { label: "Instagram", href: withProtocol(l.instagram) },
    l.facebook && { label: "Facebook", href: withProtocol(l.facebook) },
    l.youtube && { label: "YouTube", href: withProtocol(l.youtube) },
    l.maps && { label: "Get directions", href: withProtocol(l.maps) },
    l.website && { label: "Visit our website", href: withProtocol(l.website) },
  ].filter(Boolean);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const services = (b.services || []).filter((s) => s.name);

  return (
    <main className="shop">
      <div className="cover" style={b.coverUrl ? { backgroundImage: `url(${assetUrl(b.coverUrl)})` } : undefined} />
      <div className="shop-body">
        {b.logoUrl && <img className="logo" src={assetUrl(b.logoUrl)} alt={`${b.name} logo`} />}
        <h1>{b.name}</h1>
        {b.description && <p className="desc">{b.description}</p>}

        <nav className="links">
          {buttons.map((btn) => (
            <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
              className={btn.primary ? "link primary" : "link"}>
              {btn.label}
            </a>
          ))}
        </nav>

        {services.length > 0 && (
          <section>
            <h2>Services and menu</h2>
            <ul className="list">
              {services.map((s, i) => (
                <li key={i}><span>{s.name}</span><span>{s.price}</span></li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2>Opening hours</h2>
          <ul className="list">
            {b.hours.map((h) => (
              <li key={h.day} className={h.day === today ? "today" : ""}>
                <span>{h.day}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer>Powered by fastNFC</footer>
      </div>
    </main>
  );
}

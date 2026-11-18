/* eslint-disable @next/next/no-img-element */
const TEAM = [
  {
    role: "Founder",
    name: "Mithilesh Das",
    linkedin: "https://www.linkedin.com/in/mithilesh-das-18a2b4320",
  },
  {
    role: "Co-founder",
    name: "Abhishek Chakraborty",
    linkedin:
      "https://www.linkedin.com/in/abhishek-chakraborty-best-seo-specialist-silchar",
  },
  {
    role: "Co-founder",
    name: "PranabJyoti Rakshit",
    linkedin: "https://www.linkedin.com/in/pranav-rakshit-894a61327",
  },
];

const CONTACT_PHONE = "9864332295";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-inner">
        <div>
          <div className="footer-brand">
            <img alt="" src="/abvp-logo.svg" />
            <strong>ABVP Assam University</strong>
          </div>
          <p>
            A student feedback initiative for the Assam University Students&apos;
            Union Elections, 2026. Not affiliated with the university&apos;s
            official examination services.
          </p>
        </div>
        <div className="foot-right">
          Gyan · Sheel · Ekta
          <br />
          Student Manifesto Drive · 2026
        </div>
      </div>

      <div className="wrap credits">
        <div className="credits-brand">
          <span className="credits-label">Developed by</span>
          <img
            alt="Digital Map – Navigate your growth"
            className="credits-logo"
            src="/digital-map-logo.png"
          />
          <a className="credits-contact" href={`tel:+91${CONTACT_PHONE}`}>
            <span className="credits-role">Contact Digital Map</span>
            <strong>{CONTACT_PHONE}</strong>
          </a>
        </div>
        <ul className="credits-team">
          {TEAM.map((m) => (
            <li key={m.name}>
              <span className="credits-role">{m.role}</span>
              <a
                className="linkedin-link"
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn (opens in a new tab)`}
              >
                <strong>{m.name}</strong>
                <span className="linkedin-badge" aria-hidden="true">in</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

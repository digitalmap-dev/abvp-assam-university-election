/* eslint-disable @next/next/no-img-element */
export default function Header() {
  return (
    <header>
      <div className="wrap top">
        <div className="brand">
          <img alt="ABVP logo" className="logo" src="/abvp-logo.svg" />
          <div>
            <div className="brand-name">ABVP</div>
            <div className="brand-sub">Assam University Unit</div>
          </div>
        </div>
        <a className="toplink" href="#survey">
          Share your voice ↗
        </a>
      </div>
    </header>
  );
}

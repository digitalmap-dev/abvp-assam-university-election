export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">
            Assam University Students&apos; Union Elections · 2026
          </div>
          <h1>
            Write the
            <br />
            <em>manifesto</em>
            <br />
            with us.
          </h1>
          <p className="lead">
            Before the promises are made, we want to hear from you. Tell us what
            needs to change at Assam University — and what you&apos;d like to
            see done better.
          </p>
          <a className="cta" href="#survey">
            Start the survey <span aria-hidden="true">↗</span>
          </a>
          <span className="under">
            4 short steps · No name or phone number required
          </span>
        </div>

        <div aria-label="Your voice, our manifesto" className="hero-art">
          <div className="art-top">
            <span>Students first. Always.</span>
            <span className="art-num">2026</span>
          </div>
          <div className="art-words">
            <span>Your</span>
            <span className="outline">Voice.</span>
            <span className="orange">Our</span>
            <span>Manifesto.</span>
          </div>
          <div className="art-foot">
            <span>Silchar &amp; Diphu campuses</span>
            <span>Scan · Speak · Shape</span>
          </div>
        </div>
      </div>
    </section>
  );
}

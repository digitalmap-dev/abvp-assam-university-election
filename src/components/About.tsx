const STEPS = [
  { num: "01", title: "Pick issues", text: "Choose your top concerns." },
  { num: "02", title: "Rate facilities", text: "Tell us what needs work." },
  { num: "03", title: "Suggest change", text: "Write your own idea." },
  { num: "04", title: "About your studies", text: "Share programme details." },
];

export default function About() {
  return (
    <section className="wrap about">
      <div>
        <div className="kicker">Why we&apos;re asking</div>
        <h2>A manifesto should begin with students.</h2>
      </div>
      <div>
        <p>
          We are inviting students across departments and programmes to share
          what matters most to them. Your responses will help ABVP identify
          student concerns and develop its proposed campus priorities.
        </p>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step-note" key={s.num}>
              <strong>{s.num}</strong>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

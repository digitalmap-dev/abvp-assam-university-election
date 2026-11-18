const ITEMS = ["YOUR CAMPUS", "YOUR CONCERNS", "YOUR SUGGESTIONS", "YOUR MANIFESTO"];

export default function Ticker() {
  return (
    <div className="ticker">
      <p>{ITEMS.join("  /  ")}</p>
    </div>
  );
}

import { STEP_COUNT } from "./data";

export default function ProgressBar({ step }: { step: number }) {
  return (
    <div aria-label="Survey progress" className="progress">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <div key={i} className={i <= step ? "active" : undefined} />
      ))}
    </div>
  );
}

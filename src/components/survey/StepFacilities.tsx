import { FACILITIES, type Ratings } from "./data";

type Props = {
  ratings: Ratings;
  onRate: (label: string, score: number) => void;
};

export default function StepFacilities({ ratings, onRate }: Props) {
  return (
    <section className="pane">
      <div className="question-tag">Step 02 / 04 · Campus experience</div>
      <h3>How are campus facilities?</h3>
      <p className="hint">
        Rate the areas you&apos;re familiar with, or leave them unanswered. 1 =
        Poor, 5 = Excellent.
      </p>
      <div className="rating-list">
        {FACILITIES.map((label) => (
          <div className="rating" key={label}>
            <strong>{label}</strong>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((n) => {
                const on = ratings[label] === n;
                return (
                  <button
                    key={n}
                    type="button"
                    className={`ratebtn${on ? " selected" : ""}`}
                    title={`${n} out of 5`}
                    aria-label={`${label}: ${n} out of 5`}
                    aria-pressed={on}
                    onClick={() => onRate(label, n)}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

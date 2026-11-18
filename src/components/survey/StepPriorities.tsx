import { ISSUES, type FieldSetter } from "./data";

type Props = {
  selected: string[];
  onToggle: (issue: string) => void;
  other: string;
  onChange: FieldSetter;
};

export default function StepPriorities({
  selected,
  onToggle,
  other,
  onChange,
}: Props) {
  return (
    <section className="pane">
      <div className="question-tag">Step 01 / 04 · Your priorities</div>
      <h3>What should we fix first?</h3>
      <p className="hint">Choose as many concerns as you like.</p>
      <div className="issues">
        {ISSUES.map((issue) => {
          const on = selected.includes(issue);
          return (
            <button
              key={issue}
              type="button"
              className={`issue${on ? " selected" : ""}`}
              aria-pressed={on}
              onClick={() => onToggle(issue)}
            >
              <span className="indicator" aria-hidden="true">
                {on ? "✓" : ""}
              </span>
              <span>{issue}</span>
            </button>
          );
        })}
      </div>
      <div className="formrow">
        <label className="field-label" htmlFor="other">
          Something else? (optional)
        </label>
        <input
          className="field"
          id="other"
          maxLength={180}
          placeholder="Write another campus issue"
          value={other}
          onChange={onChange("other")}
        />
      </div>
    </section>
  );
}

import type { FieldSetter, FormValues } from "./data";

type Props = {
  form: FormValues;
  onChange: FieldSetter;
};

export default function StepIdea({ form, onChange }: Props) {
  return (
    <section className="pane">
      <div className="question-tag">Step 03 / 04 · Your idea</div>
      <h3>What should change?</h3>
      <p className="hint">
        The most useful suggestions explain the issue and a practical
        improvement.
      </p>
      <div className="formrow">
        <label className="field-label" htmlFor="problem">
          What is the biggest problem you face? <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="field"
          id="problem"
          maxLength={1200}
          placeholder="For example, which facility or academic process needs improvement?"
          value={form.problem}
          onChange={onChange("problem")}
        />
      </div>
      <div className="formrow">
        <label className="field-label" htmlFor="solution">
          What would you like the students&apos; union to do about it?{" "}
          <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="field"
          id="solution"
          maxLength={1200}
          placeholder="Your suggestion in your own words"
          value={form.solution}
          onChange={onChange("solution")}
        />
      </div>
    </section>
  );
}

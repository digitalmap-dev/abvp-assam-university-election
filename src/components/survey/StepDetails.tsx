import type { FieldSetter, FormValues } from "./data";

type Props = {
  form: FormValues;
  onChange: FieldSetter;
};

export default function StepDetails({ form, onChange }: Props) {
  return (
    <section className="pane">
      <div className="question-tag">Step 04 / 04 · Student details</div>
      <h3>Tell us about your studies.</h3>
      <p className="hint">
        These details help us understand concerns across programmes. Do not
        enter your roll number or other sensitive information.
      </p>

      <div className="two">
        <div className="formrow">
          <label className="field-label" htmlFor="studentName">
            Full name{" "}
            <span aria-hidden="true" className="required">
              *
            </span>
          </label>
          <input
            className="field"
            id="studentName"
            name="studentName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            placeholder="Enter your full name"
            required
            value={form.studentName}
            onChange={onChange("studentName")}
          />
        </div>
        <div className="formrow">
          <label className="field-label" htmlFor="studentPhone">
            Phone number{" "}
            <span aria-hidden="true" className="required">
              *
            </span>
          </label>
          <input
            className="field"
            id="studentPhone"
            name="studentPhone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            minLength={10}
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            placeholder="10-digit mobile number"
            required
            value={form.studentPhone}
            onChange={onChange("studentPhone")}
          />
        </div>
      </div>
      <p className="privacy">
        Both fields are mandatory. Please enter your own contact information.
      </p>

      <div className="formrow">
        <label className="field-label" htmlFor="campus">
          Campus
        </label>
        <select
          className="field"
          id="campus"
          value={form.campus}
          onChange={onChange("campus")}
        >
          <option value="">Select campus (optional)</option>
          <option>Silchar</option>
          <option>Diphu</option>
          <option>Other / affiliated college</option>
        </select>
      </div>

      <div className="formrow">
        <label className="field-label" htmlFor="programme">
          Your programme (type manually)
        </label>
        <input
          className="field"
          id="programme"
          maxLength={120}
          placeholder="e.g. B.A. English, M.Sc. Physics, B.Tech CSE"
          value={form.programme}
          onChange={onChange("programme")}
        />
      </div>

      <div className="two">
        <div className="formrow">
          <label className="field-label" htmlFor="year">
            Current year of study
          </label>
          <input
            className="field"
            id="year"
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            placeholder="e.g. 2"
            value={form.year}
            onChange={onChange("year")}
          />
        </div>
        <div className="formrow">
          <label className="field-label" htmlFor="semester">
            Current semester (if applicable)
          </label>
          <input
            className="field"
            id="semester"
            type="number"
            inputMode="numeric"
            min={1}
            max={24}
            placeholder="e.g. 3"
            value={form.semester}
            onChange={onChange("semester")}
          />
        </div>
      </div>
      <p className="privacy">
        Year and semester are entered separately because programme structures
        vary. Please use the details applicable to your own course.
      </p>

      <div className="formrow">
        <label className="field-label" htmlFor="system">
          Academic framework (optional)
        </label>
        <select
          className="field"
          id="system"
          value={form.system}
          onChange={onChange("system")}
        >
          <option value="">Select if applicable</option>
          <option>NEP / FYUGP</option>
          <option>CBCS</option>
          <option>Other</option>
          <option>Not sure</option>
        </select>
      </div>

      <div className="formrow">
        <label className="field-label" htmlFor="dept">
          Department (optional)
        </label>
        <input
          className="field"
          id="dept"
          maxLength={120}
          placeholder="Type your department"
          value={form.dept}
          onChange={onChange("dept")}
        />
      </div>
    </section>
  );
}

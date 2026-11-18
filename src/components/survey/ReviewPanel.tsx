import type { SurveyResponse } from "./data";

type Props = {
  response: SurveyResponse;
  onExportJson: () => void;
};

const orDash = (s: string) => s || "—";

export default function ReviewPanel({ response: d, onExportJson }: Props) {
  const priorities = d.issues
    .concat(d.otherIssue ? [d.otherIssue] : [])
    .join(", ");
  const facilities = Object.entries(d.ratings)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(" · ");
  const details = [
    d.campus,
    d.programme,
    d.year ? `Year ${d.year}` : "",
    d.semester ? `Semester ${d.semester}` : "",
    d.academicFramework,
    d.department,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div id="reviewPanel">
      <div className="question-tag">Your responses</div>
      <h3>Review your answers</h3>
      <p className="hint">
        Please check your details, then submit your response to ABVP Assam
        University. You can go back to change anything before submitting.
      </p>
      <div className="review">
        <div className="review-section">
          <b>Priorities</b>
          <p>{orDash(priorities)}</p>
        </div>
        <div className="review-section">
          <b>Facilities</b>
          <p>{orDash(facilities)}</p>
        </div>
        <div className="review-section">
          <b>Problem</b>
          <p>{orDash(d.problem)}</p>
          <b>Suggestion</b>
          <p>{orDash(d.suggestion)}</p>
        </div>
        <div className="review-section">
          <b>Name</b>
          <p>{orDash(d.name)}</p>
          <b>Phone number</b>
          <p>{orDash(d.phone)}</p>
        </div>
        <div className="review-section">
          <b>Student details</b>
          <p>{orDash(details)}</p>
        </div>
      </div>
      <button type="button" className="back export-json" onClick={onExportJson}>
        Download original data (JSON)
      </button>
    </div>
  );
}

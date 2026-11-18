type Props = {
  onExportJson: () => void;
};

export default function DonePanel({ onExportJson }: Props) {
  return (
    <div className="done">
      <div className="question-tag">Response received</div>
      <h3>Thank you for helping write the manifesto!</h3>
      <p className="hint">
        Your response has been submitted to ABVP Assam University. You can also
        keep a copy for yourself.
      </p>
      <button type="button" className="back export-json done-json" onClick={onExportJson}>
        Download original data (JSON)
      </button>
    </div>
  );
}

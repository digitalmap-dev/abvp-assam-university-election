"use client";

import { useEffect, useRef, useState } from "react";
import {
  EMPTY_FORM,
  SANITIZERS,
  STEP_COUNT,
  SURVEY_TITLE,
  downloadFile,
  toResponse,
  validateStep,
  type FieldSetter,
  type FormValues,
  type Ratings,
} from "./data";
import { buildResponseDocument } from "./responseDocument";
import ProgressBar from "./ProgressBar";
import StepPriorities from "./StepPriorities";
import StepFacilities from "./StepFacilities";
import StepIdea from "./StepIdea";
import StepDetails from "./StepDetails";
import ReviewPanel from "./ReviewPanel";
import DonePanel from "./DonePanel";

export default function Survey() {
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const surveyRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);

  // Bring the survey into view whenever the step or review screen changes
  // (not on first render, so the page doesn't jump on load).
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    surveyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, review, submitted]);

  // Remove any "#survey" left in the address bar by older shared links.
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // Each field only keeps the characters it allows (see SANITIZERS).
  const onChange: FieldSetter = (key) => (e) => {
    const clean = SANITIZERS[key];
    const value = clean ? clean(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleIssue = (issue: string) =>
    setSelected((s) =>
      s.includes(issue) ? s.filter((i) => i !== issue) : [...s, issue],
    );

  const rate = (label: string, n: number) =>
    setRatings((r) => {
      const next = { ...r };
      if (next[label] === n) delete next[label];
      else next[label] = n;
      return next;
    });

  const response = toResponse(selected, ratings, form);

  const goTo = (n: number) => {
    setStep(n);
    setError("");
  };

  const onBack = () => {
    if (submitted || submitting) return;
    if (review) {
      setReview(false);
      goTo(STEP_COUNT - 1);
    } else if (step > 0) {
      goTo(step - 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
      const result = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !result.ok)
        throw new Error(result.error || "Could not submit. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Network error. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = () => {
    if (submitting) return;
    if (submitted) {
      downloadFile(
        buildResponseDocument(response),
        "student-manifesto-response.html",
        "text/html;charset=utf-8",
      );
      return;
    }
    if (review) {
      void submit();
      return;
    }
    const msg = validateStep(step, selected, form);
    if (msg) {
      setError(msg);
      return;
    }
    if (step < STEP_COUNT - 1) goTo(step + 1);
    else {
      setReview(true);
      setError("");
    }
  };

  const exportJson = () =>
    downloadFile(
      JSON.stringify({ survey: SURVEY_TITLE, ...response }, null, 2),
      "student-manifesto-response.json",
      "application/json",
    );

  const nextLabel = submitted
    ? "Download designed response ↓"
    : submitting
      ? "Submitting…"
      : review
        ? "Submit response →"
        : step === STEP_COUNT - 1
      ? "Review answers →"
      : "Continue →";

  return (
    <section className="survey" id="survey" ref={surveyRef}>
      <div className="wrap">
        <div className="survey-frame">
          <div className="survey-head">
            <div className="kicker">The student survey</div>
            <h2>Help write the manifesto.</h2>
            <p>
              Start with the campus issues that matter to you. About 3 minutes
              · Name required.
            </p>
          </div>

          <ProgressBar step={step} />

          <div className="formarea">
            {submitted ? (
              <DonePanel onExportJson={exportJson} />
            ) : review ? (
              <ReviewPanel response={response} onExportJson={exportJson} />
            ) : (
              <>
                {step === 0 && (
                  <StepPriorities
                    selected={selected}
                    onToggle={toggleIssue}
                    other={form.other}
                    onChange={onChange}
                  />
                )}
                {step === 1 && (
                  <StepFacilities ratings={ratings} onRate={rate} />
                )}
                {step === 2 && <StepIdea form={form} onChange={onChange} />}
                {step === 3 && <StepDetails form={form} onChange={onChange} />}
              </>
            )}

            <div className="error" role="alert">
              {error}
            </div>
            <div className="actions">
              <button
                className={`back${(step === 0 && !review) || submitted ? " invisible" : ""}`}
                type="button"
                onClick={onBack}
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                className="next"
                type="button"
                onClick={onNext}
                disabled={submitting}
              >
                {nextLabel}
              </button>
            </div>
            <div className="privacy">
              This is an independent ABVP student feedback initiative, not an
              official Assam University form. When you submit, your responses
              (including your name and any phone number you give) are sent to
              and stored by
              ABVP Assam University for preparing the manifesto.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

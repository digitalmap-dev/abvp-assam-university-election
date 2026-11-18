import type { ChangeEvent } from "react";

export const SURVEY_TITLE = "ABVP Assam University Student Manifesto 2026";

export const ISSUES = [
  "24/7 Library & Reading Room",
  "Hostel Seats & Sanitation",
  "Campus-wide Wi-Fi",
  "University Bus Service",
  "Canteen Quality & Prices",
  "Modern Labs & Equipment",
  "Sports & Gym Facilities",
  "Placement & Internships",
  "Health Centre & Ambulance",
  "Women's Safety & Lighting",
  "Timely Exams & Results",
  "Fee Transparency",
];

export const FACILITIES = [
  "Library & reading room",
  "Hostel facilities",
  "Campus Wi-Fi",
  "Transport",
  "Canteen",
  "Examination services",
];

export const STEP_COUNT = 4;

export type FormValues = {
  other: string;
  problem: string;
  solution: string;
  studentName: string;
  studentPhone: string;
  campus: string;
  programme: string;
  year: string;
  semester: string;
  system: string;
  dept: string;
};

export const EMPTY_FORM: FormValues = {
  other: "",
  problem: "",
  solution: "",
  studentName: "",
  studentPhone: "",
  campus: "",
  programme: "",
  year: "",
  semester: "",
  system: "",
  dept: "",
};

export type Ratings = Record<string, number>;

/** Change-handler factory shared by every step's inputs. */
export type FieldSetter = (
  key: keyof FormValues,
) => (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) => void;

/** The response shown on the review screen and exported. */
export type SurveyResponse = {
  name: string;
  phone: string;
  issues: string[];
  otherIssue: string;
  ratings: Ratings;
  problem: string;
  suggestion: string;
  campus: string;
  programme: string;
  year: string;
  semester: string;
  academicFramework: string;
  department: string;
};

export function toResponse(
  selected: string[],
  ratings: Ratings,
  form: FormValues,
): SurveyResponse {
  return {
    name: form.studentName.trim(),
    phone: form.studentPhone.trim(),
    issues: selected,
    otherIssue: form.other.trim(),
    ratings,
    problem: form.problem.trim(),
    suggestion: form.solution.trim(),
    campus: form.campus,
    programme: form.programme.trim(),
    year: form.year,
    semester: form.semester,
    academicFramework: form.system,
    department: form.dept.trim(),
  };
}

const validNumber = (v: string, max: number) =>
  !v || (Number.isInteger(+v) && +v >= 1 && +v <= max);

/** Returns an error message for the given step, or "" when it is valid. */
export function validateStep(
  step: number,
  selected: string[],
  form: FormValues,
): string {
  if (step === 0 && !selected.length && !form.other.trim())
    return "Choose at least one issue or write another issue.";
  if (step === 2 && (!form.problem.trim() || !form.solution.trim()))
    return "Please describe the problem and your suggested solution.";
  if (step === 3) {
    if (form.studentName.trim().length < 2)
      return "Please enter your full name (at least 2 characters).";
    if (!validNumber(form.year, 12) || !validNumber(form.semester, 24))
      return "Please enter a valid year or semester, or leave it blank.";
  }
  return "";
}

/** Triggers a browser download of the given content. */
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

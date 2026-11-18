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
    phone: normalizePhone(form.studentPhone) ?? form.studentPhone.trim(),
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

/* ------------------------------------------------------------------ */
/* Field rules — shared by the browser form and the /api/submit route */
/* ------------------------------------------------------------------ */

/** Name: letters (any language), spaces, dot, apostrophe, hyphen. */
export const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

/** Programme / department: letters, digits, spaces and . , & ( ) / - */
export const COURSE_PATTERN = /^[\p{L}\p{M}0-9 .,&()/-]*$/u;

/**
 * Character filters applied while the user types, so a field can only ever
 * contain the kind of characters it is meant for.
 */
export const SANITIZERS: Partial<Record<keyof FormValues, (v: string) => string>> = {
  studentName: (v) => v.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 100),
  studentPhone: (v) => v.replace(/[^\d+\s-]/g, "").slice(0, 16),
  year: (v) => v.replace(/\D/g, "").slice(0, 2),
  semester: (v) => v.replace(/\D/g, "").slice(0, 2),
  programme: (v) => v.replace(/[^\p{L}\p{M}0-9 .,&()/-]/gu, "").slice(0, 120),
  dept: (v) => v.replace(/[^\p{L}\p{M}0-9 .,&()/-]/gu, "").slice(0, 120),
};

/**
 * Phone is optional. Returns "" when empty, the 10-digit number when valid
 * (accepts +91 / 91 / 0 prefixes, spaces and hyphens), or null when invalid.
 */
export function normalizePhone(value: string): string | null {
  const compact = value.replace(/[\s-]/g, "");
  if (!compact) return "";
  const m = compact.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return m ? m[1] : null;
}

export const validNumber = (v: string, max: number) =>
  !v || (/^\d{1,2}$/.test(v) && +v >= 1 && +v <= max);

/** Checks the student-details fields; returns an error message or "". */
export function validateDetails(d: {
  name: string;
  phone: string;
  programme: string;
  department: string;
  year: string;
  semester: string;
}): string {
  const name = d.name.trim();
  if (name.length < 2) return "Please enter your full name (at least 2 characters).";
  if (!NAME_PATTERN.test(name))
    return "Name can only contain letters, spaces, dots, apostrophes and hyphens.";
  if (normalizePhone(d.phone) === null)
    return "Please enter a valid 10-digit mobile number (starting with 6–9), or leave it blank.";
  if (!COURSE_PATTERN.test(d.programme.trim()) || !COURSE_PATTERN.test(d.department.trim()))
    return "Programme and department can only contain letters, numbers and . , & ( ) / -";
  if (!validNumber(d.year, 12)) return "Year of study must be a number from 1 to 12, or left blank.";
  if (!validNumber(d.semester, 24)) return "Semester must be a number from 1 to 24, or left blank.";
  return "";
}

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
  if (step === 3)
    return validateDetails({
      name: form.studentName,
      phone: form.studentPhone,
      programme: form.programme,
      department: form.dept,
      year: form.year,
      semester: form.semester,
    });
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

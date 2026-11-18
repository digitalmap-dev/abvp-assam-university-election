import { FACILITIES, ISSUES, type SurveyResponse } from "@/components/survey/data";

/**
 * Receives a survey response from the browser, checks it, and forwards it to
 * the Google Apps Script web app, which appends a row to the Google Sheet.
 *
 * Needs these in .env.local (see .env.example):
 *   GOOGLE_SCRIPT_URL     the Apps Script web app URL (ends in /exec)
 *   GOOGLE_SCRIPT_SECRET  the same value as the script's SECRET property
 */

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function clean(body: unknown): SurveyResponse | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const b = body as Record<string, unknown>;

  const issues = Array.isArray(b.issues)
    ? b.issues.filter((i): i is string => typeof i === "string" && ISSUES.includes(i))
    : [];

  const ratings: Record<string, number> = {};
  if (b.ratings && typeof b.ratings === "object") {
    for (const [k, v] of Object.entries(b.ratings as Record<string, unknown>)) {
      if (FACILITIES.includes(k) && Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 5)
        ratings[k] = v as number;
    }
  }

  const r: SurveyResponse = {
    name: str(b.name, 100),
    phone: str(b.phone, 40),
    issues,
    otherIssue: str(b.otherIssue, 180),
    ratings,
    problem: str(b.problem, 1200),
    suggestion: str(b.suggestion, 1200),
    campus: str(b.campus, 60),
    programme: str(b.programme, 120),
    year: str(b.year, 2),
    semester: str(b.semester, 2),
    academicFramework: str(b.academicFramework, 40),
    department: str(b.department, 120),
  };

  if (r.name.length < 2) return "Please enter your full name.";
  if (!r.issues.length && !r.otherIssue) return "Choose at least one issue.";
  if (!r.problem || !r.suggestion) return "Please describe the problem and your suggestion.";
  return r;
}

export async function POST(request: Request) {
  const url = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error("GOOGLE_SCRIPT_URL / GOOGLE_SCRIPT_SECRET are not set");
    return Response.json(
      { ok: false, error: "Submissions are not set up yet. Please try again later." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const response = clean(body);
  if (typeof response === "string") {
    return Response.json({ ok: false, error: response }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, response }),
      redirect: "follow",
      cache: "no-store",
    });
    const result = (await res.json()) as { ok?: boolean; error?: string };
    if (!result.ok) throw new Error(result.error || `Apps Script returned ${res.status}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Google Sheets submission failed:", err);
    return Response.json(
      { ok: false, error: "Could not save your response. Please try again." },
      { status: 502 },
    );
  }
}

import type { SurveyResponse } from "./data";

/**
 * Builds the standalone, printable "designed response" HTML file that the
 * student downloads after reviewing their answers.
 *
 * Note: this CSS is intentionally NOT in globals.css — it is embedded inside
 * the downloaded file, which is opened on its own outside this website.
 */
const DOCUMENT_CSS = `
:root{--navy:#142d3d;--orange:#e96534;--ink:#172d3b;--muted:#697780;--line:#dce3e4}
*{box-sizing:border-box}body{margin:0;background:#edf2f3;color:var(--ink);font-family:Arial,Helvetica,sans-serif;line-height:1.6}
.sheet{max-width:830px;margin:36px auto;background:white;box-shadow:0 16px 46px rgba(20,45,61,.13);overflow:hidden}
.cover{background:var(--navy);color:white;padding:35px 44px 34px;position:relative}.cover:after{content:'';position:absolute;right:-58px;top:-95px;width:280px;height:280px;border:43px solid rgba(255,255,255,.045);border-radius:50%}.eyebrow{color:#ffb498;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.cover h1{font-size:34px;line-height:1.15;margin:12px 0 8px;letter-spacing:-1px}.cover p{font-size:13px;color:#cbd9df;margin:0}.accent{height:6px;background:var(--orange)}.content{padding:35px 44px 45px}.section{margin-bottom:28px}.section h2{font-size:15px;letter-spacing:.25px;margin:0 0 14px;display:flex;align-items:center;gap:12px;color:#142d3d}.num{font-size:11px;color:var(--orange);font-weight:800;border:1px solid #f2c6b3;padding:3px 8px}.identity{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.datum{background:#f7f9f8;border:1px solid #e7edeb;padding:12px 14px;min-width:0}.datum .key{font-size:10px;color:#70808a;font-weight:700;letter-spacing:.75px;text-transform:uppercase}.datum .val{font-size:14px;font-weight:700;margin-top:3px;overflow-wrap:anywhere}.issues{display:flex;gap:9px;flex-wrap:wrap}.issue{background:#fff1e9;border:1px solid #f6d3c0;color:#9a3c1d;padding:9px 12px;font-size:13px;font-weight:700}.rating{border:1px solid #e4e8e7;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 15px;margin:9px 0}.stars{letter-spacing:2px;color:#e96534;font-size:19px;white-space:nowrap}.score{font-size:12px;color:#687982;margin-left:5px}.statement{background:#f7f9f8;border-left:3px solid var(--orange);padding:17px 20px;margin-bottom:13px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px}.statement .lbl{font-size:10px;color:#627783;letter-spacing:1px;font-weight:800;text-transform:uppercase;margin-bottom:5px}.footer{background:#f4f6f5;border-top:1px solid #e5ebea;padding:17px 44px;font-size:11px;color:#64727b;display:flex;justify-content:space-between;gap:20px}.toolbar{max-width:830px;margin:22px auto 0;display:flex;justify-content:flex-end;gap:10px}.toolbar button{border:0;background:#142d3d;color:white;padding:11px 18px;font-weight:700;cursor:pointer}.toolbar .secondary{background:white;color:#142d3d;border:1px solid #bdcace}
@media(max-width:640px){.sheet{margin:12px}.toolbar{margin:16px 12px}.cover{padding:27px 24px}.cover h1{font-size:26px}.content{padding:25px 22px}.identity{grid-template-columns:1fr}.footer{padding:17px 22px;display:block}.rating{align-items:flex-start;flex-direction:column}}
@media print{@page{size:A4;margin:12mm}body{background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{display:none}.sheet{margin:0;max-width:none;box-shadow:none}.cover{padding:25px 32px}.content{padding:26px 32px}.footer{padding:15px 32px}.section{break-inside:avoid}.statement{break-inside:avoid}}
`;

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeText = (x: unknown) =>
  String(x === undefined || x === null || x === "" ? "Not provided" : x).replace(
    /[&<>"']/g,
    (ch) => ENTITIES[ch],
  );

const detail = (label: string, value: string) =>
  '<div class="datum"><div class="key">' +
  escapeText(label) +
  '</div><div class="val">' +
  escapeText(value) +
  "</div></div>";

export function buildResponseDocument(d: SurveyResponse): string {
  const ratingRows = Object.entries(d.ratings || {})
    .map(([label, score]) => {
      const n = Math.max(0, Math.min(5, Number(score) || 0));
      return (
        '<div class="rating"><strong>' +
        escapeText(label) +
        '</strong><div><span class="stars" aria-label="' +
        n +
        ' out of 5">' +
        "★".repeat(n) +
        '<span style="color:#cbd5d8">' +
        "☆".repeat(5 - n) +
        '</span></span><span class="score">' +
        n +
        "/5</span></div></div>"
      );
    })
    .join("");

  const issues = [...(d.issues || []), ...(d.otherIssue ? [d.otherIssue] : [])];

  return (
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Student Manifesto Response - ' +
    escapeText(d.name) +
    "</title><style>" +
    DOCUMENT_CSS +
    "</style></head><body>" +
    '<div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button></div><main class="sheet"><header class="cover"><div class="eyebrow">ABVP · Assam University · 2026</div><h1>Student Manifesto<br>Response</h1><p>Your voice. Your campus. Your priorities.</p></header><div class="accent"></div><div class="content">' +
    '<section class="section"><h2><span class="num">01</span> Student information</h2><div class="identity">' +
    detail("Student name", d.name) +
    detail("Phone number", d.phone) +
    detail("Campus", d.campus) +
    detail("Department", d.department) +
    detail("Programme", d.programme) +
    detail("Academic year", d.year ? "Year " + d.year : "") +
    detail("Semester", d.semester ? "Semester " + d.semester : "") +
    detail("Academic framework", d.academicFramework) +
    "</div></section>" +
    '<section class="section"><h2><span class="num">02</span> Campus priorities</h2><div class="issues">' +
    (issues.length
      ? issues.map((i) => '<span class="issue">' + escapeText(i) + "</span>").join("")
      : "<span>No issues selected</span>") +
    "</div></section>" +
    '<section class="section"><h2><span class="num">03</span> Facility ratings</h2>' +
    (ratingRows || "<p>No facilities rated.</p>") +
    "</section>" +
    '<section class="section"><h2><span class="num">04</span> Your feedback & suggestions</h2><div class="statement"><div class="lbl">Problem raised</div>' +
    escapeText(d.problem) +
    '</div><div class="statement"><div class="lbl">Suggested solution</div>' +
    escapeText(d.suggestion) +
    "</div></section></div>" +
    '<footer class="footer"><span>ABVP Assam University Student Manifesto 2026</span><span>Student-submitted response · For review</span></footer></main></body></html>'
  );
}

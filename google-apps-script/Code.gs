/**
 * ABVP Assam University – Student Manifesto Survey → Google Sheets
 *
 * Receives survey responses from the website (/api/submit) and appends one
 * row per response to the "Responses" sheet.
 *
 * SETUP (one time):
 *  1. Open the Google Sheet (link below) → Extensions → Apps Script.
 *     Rows go into a "Responses" tab, which is created automatically.
 *  2. Replace everything in Code.gs with this file and click Save.
 *  3. Project Settings (gear icon) → Script Properties → Add property:
 *       Property: SECRET    Value: <a long random string>
 *     Use the SAME value for GOOGLE_SCRIPT_SECRET in the website's .env.local.
 *  4. Deploy → New deployment → type "Web app":
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Click Deploy, authorise, and copy the Web app URL (ends in /exec).
 *     Put it in GOOGLE_SCRIPT_URL in the website's .env.local.
 *
 * After editing this script later: Deploy → Manage deployments → Edit (pencil)
 * → Version: "New version" → Deploy. (The URL stays the same.)
 */

// The Google Sheet that receives responses:
// https://docs.google.com/spreadsheets/d/1oeBRYemSv5U4hHhBau-aaKAO4n-_NdV0kn8uWHyuD1c/edit
const SPREADSHEET_ID = '1oeBRYemSv5U4hHhBau-aaKAO4n-_NdV0kn8uWHyuD1c';
const SHEET_NAME = 'Responses';

const FACILITIES = [
  'Library & reading room',
  'Hostel facilities',
  'Campus Wi-Fi',
  'Transport',
  'Canteen',
  'Examination services',
];

const HEADERS = [
  'Submitted at',
  'Name',
  'Phone',
  'Campus',
  'Programme',
  'Year',
  'Semester',
  'Academic framework',
  'Department',
  'Priorities',
  'Other issue',
  ...FACILITIES.map(function (f) { return 'Rating: ' + f; }),
  'Problem',
  'Suggestion',
];

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) {
      return json_({ ok: false, error: 'Unauthorised' });
    }

    const d = body.response || {};
    const ratings = d.ratings || {};

    const row = [
      new Date(),
      text_(d.name),
      text_(d.phone),
      text_(d.campus),
      text_(d.programme),
      text_(d.year),
      text_(d.semester),
      text_(d.academicFramework),
      text_(d.department),
      text_((d.issues || []).join(', ')),
      text_(d.otherIssue),
    ]
      .concat(FACILITIES.map(function (f) { return ratings[f] || ''; }))
      .concat([text_(d.problem), text_(d.suggestion)]);

    // Prevent two simultaneous submissions from clashing.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = getSheet_();
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Lets you open the /exec URL in a browser to check the deployment works. */
function doGet() {
  return json_({ ok: true, message: 'Survey endpoint is running.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Stores values as plain text. Values that start with = + - @ are prefixed
 * with an apostrophe so the sheet never treats user input as a formula, and
 * phone numbers keep their exact digits.
 */
function text_(value) {
  const s = String(value === undefined || value === null ? '' : value).trim();
  if (s === '') return '';
  return /^[=+\-@0-9]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

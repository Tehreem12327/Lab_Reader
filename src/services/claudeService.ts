// ============================================================
// LabReader — Mock AI Engine  (claudeService.ts)
// Client-side only.  No real backend or network calls.
//
// Dynamic routing pipeline (evaluated top-to-bottom on uploadedText):
//   1. Lipid keywords   → LIPID   scenario  (critical)
//   2. Glucose keywords → GLUCOSE scenario  (critical)
//   3. BP keywords      → BP      scenario  (attention)
//   4. Heart keywords   → HEART   scenario  (attention)
//   5. Liver keywords   → LIVER   scenario  (attention)
//   6. No match / demo  → selected A / B / C scenario
//
// All paths resolve after exactly 2500 ms simulated latency.
// ============================================================

// ─── Types ────────────────────────────────────────────────────────────────────

/** Four-tier severity: drives card color + sort priority. */
export type MetricStatus = "critical" | "high" | "low" | "normal";

export type UrgencyLevel = "critical" | "attention" | "normal";

/** The three user-selectable demo tabs. */
export type Scenario = "A" | "B" | "C";

/** Internal routing key — includes all dynamically detected profiles. */
type ScenarioKey = Scenario | "LIPID" | "GLUCOSE" | "BP" | "HEART" | "LIVER";

// ─── Metric interface ─────────────────────────────────────────────────────────

export interface LabMetric {
  id: string;

  // Display name
  name: string;
  name_urdu: string;

  // Numeric measurement
  value: number;
  unit: string;
  rangeMin: number;
  rangeMax: number;

  // Severity
  status: MetricStatus;

  // Clinical explanation (what does this value mean?)
  description: string;
  description_urdu: string;

  // Recommended action (what should the patient do?)
  action: string;
  action_urdu: string;
}

export interface AnalysisResult {
  scenario: ScenarioKey;
  urgency: UrgencyLevel;
  metrics: LabMetric[];
  summary: string;
  summary_urdu: string;
}

// ─── Sort utility ─────────────────────────────────────────────────────────────

const STATUS_WEIGHT: Record<MetricStatus, number> = {
  critical: 0,
  high: 1,
  low: 2,
  normal: 3,
};

/**
 * Stable-sort metrics by severity: critical → high → low → normal.
 * Exported so the dashboard controller uses the same ordering definition.
 */
export function sortMetricsBySeverity(metrics: LabMetric[]): LabMetric[] {
  return [...metrics].sort(
    (a, b) => STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status]
  );
}

// ─── Keyword patterns ─────────────────────────────────────────────────────────

const PATTERNS: Record<string, RegExp> = {
  LIPID:
    /cholesterol|triglyceride|ldl|hdl|lipid/i,
  GLUCOSE:
    /glucose|sugar|hba1c|diabetes|fasting/i,
  BP:
    /\bbp\b|blood\s*pressure|systolic|diastolic|hypertension/i,
  HEART:
    /heart\s*rate|pulse|\bbpm\b|\becg\b/i,
  LIVER:
    /\balt\b|sgpt|liver|bilirubin/i,
};

function detectScenario(text: string): ScenarioKey | null {
  for (const [key, pattern] of Object.entries(PATTERNS)) {
    if (pattern.test(text)) return key as ScenarioKey;
  }
  return null;
}

// ─── Payload definitions ──────────────────────────────────────────────────────

// 1. LIPID — high-risk lipid profile
const SCENARIO_LIPID: AnalysisResult = {
  scenario: "LIPID",
  urgency: "critical",
  summary:
    "Your Lipid Profile shows critically elevated LDL levels and high Total Cholesterol. Immediate cardiovascular dietary adjustments are recommended.",
  summary_urdu:
    "آپ کی رپورٹ میں کولیسٹرول اور ایل ڈی ایل کی مقدار خطرناک حد تک زیادہ ہے! چکنائی والی غذاؤں سے فوری پرہیز کریں۔",
  metrics: [
    {
      id: "ldl",
      name: "LDL (Bad Cholesterol)",
      name_urdu: "ایل ڈی ایل (خراب کولیسٹرول)",
      value: 184,
      unit: "mg/dL",
      rangeMin: 0,
      rangeMax: 100,
      status: "critical",
      description:
        "LDL is critically elevated at 184 mg/dL — nearly double the safe limit of 100 mg/dL. This significantly increases cardiovascular risk.",
      description_urdu:
        "خراب کولیسٹرول (LDL) خطرناک حد تک ۱۸۴ mg/dL تک پہنچ گیا ہے جو محفوظ حد ۱۰۰ سے تقریباً دوگنا ہے۔",
      action:
        "Consult a cardiologist immediately. Begin a low-saturated-fat, high-fiber diet and discuss statin therapy.",
      action_urdu:
        "فوری طور پر ڈاکٹر سے رابطہ کریں۔ چکنائی والی غذائیں بند کریں اور ادویات کے بارے میں مشورہ لیں۔",
    },
    {
      id: "total_chol",
      name: "Total Cholesterol",
      name_urdu: "کل کولیسٹرول",
      value: 265,
      unit: "mg/dL",
      rangeMin: 0,
      rangeMax: 200,
      status: "high",
      description:
        "Total Cholesterol is elevated at 265 mg/dL, exceeding the recommended ceiling of 200 mg/dL.",
      description_urdu:
        "کولیسٹرول کی مقدار ۲۶۵ mg/dL ہے جو معیاری حد ۲۰۰ سے زیادہ ہے۔",
      action:
        "Reduce saturated fat and trans fat intake. Increase physical activity and monitor monthly.",
      action_urdu:
        "چکنائی والی غذاؤں سے پرہیز کریں، روزانہ واک کریں اور ماہانہ ٹیسٹ کرواتے رہیں۔",
    },
    {
      id: "hdl",
      name: "HDL (Good Cholesterol)",
      name_urdu: "ایچ ڈی ایل (اچھا کولیسٹرول)",
      value: 32,
      unit: "mg/dL",
      rangeMin: 40,
      rangeMax: 80,
      status: "low",
      description:
        "HDL (good cholesterol) is low at 32 mg/dL. Low HDL increases the risk of heart disease.",
      description_urdu:
        "اچھے کولیسٹرول (HDL) کی مقدار ۳۲ mg/dL ہے جو نارمل سے کم ہے۔ یہ دل کی بیماری کا خطرہ بڑھاتا ہے۔",
      action:
        "Increase aerobic exercise, quit smoking, and include healthy fats (olive oil, nuts) in your diet.",
      action_urdu:
        "ورزش بڑھائیں، سگریٹ نوشی چھوڑیں اور زیتون کے تیل جیسی صحت مند چکنائی کھائیں۔",
    },
  ],
};

// 2. GLUCOSE — severe glycemic spike
const SCENARIO_GLUCOSE: AnalysisResult = {
  scenario: "GLUCOSE",
  urgency: "critical",
  summary:
    "Severe glycemic spike detected. Fasting Glucose and HbA1c are well above standard diabetic reference intervals.",
  summary_urdu:
    "خون میں شوگر کی مقدار مقررہ حد سے زیادہ ہے۔ احتیاط اور ڈاکٹر سے رجوع کرنے کی فوری ضرورت ہے۔",
  metrics: [
    {
      id: "fglucose",
      name: "Fasting Blood Glucose",
      name_urdu: "خالی پیٹ خون کی شوگر",
      value: 240,
      unit: "mg/dL",
      rangeMin: 70,
      rangeMax: 100,
      status: "critical",
      description:
        "Fasting glucose is critically elevated at 240 mg/dL, far exceeding the normal range of 70–100 mg/dL. This indicates uncontrolled hyperglycemia.",
      description_urdu:
        "خالی پیٹ شوگر ۲۴۰ mg/dL ہے جو نارمل حد ۷۰–۱۰۰ سے بہت زیادہ اور خطرناک ہے۔ یہ بے قابو ذیابیطس کی علامت ہے۔",
      action:
        "Seek immediate medical attention. Adjust insulin or oral hypoglycemic therapy as directed by your physician.",
      action_urdu:
        "فوری ڈاکٹر سے ملیں۔ انسولین یا شوگر کی دوائی کے بارے میں مشورہ لیں اور میٹھی اشیاء بند کریں۔",
    },
    {
      id: "hba1c",
      name: "HbA1c",
      name_urdu: "ایچ بی اے ون سی",
      value: 8.5,
      unit: "%",
      rangeMin: 4.0,
      rangeMax: 5.7,
      status: "high",
      description:
        "HbA1c is 8.5%, indicating poor long-term blood sugar control over the past 2–3 months. Normal is below 5.7%.",
      description_urdu:
        "HbA1c ۸.۵٪ ہے جو پچھلے ۲–۳ مہینوں میں شوگر کی خراب کنٹرول کو ظاہر کرتا ہے۔ نارمل ۵.۷٪ سے کم ہونا چاہیے۔",
      action:
        "Work with your doctor to set a target HbA1c below 7%. Dietary discipline and regular monitoring are essential.",
      action_urdu:
        "ڈاکٹر کے ساتھ مل کر HbA1c ۷٪ سے نیچے لانے کا ہدف بنائیں۔ پرہیز اور باقاعدہ ٹیسٹ ضروری ہیں۔",
    },
  ],
};

// 3. BP — Stage 2 Hypertension
const SCENARIO_BP: AnalysisResult = {
  scenario: "BP",
  urgency: "attention",
  summary:
    "Elevated arterial blood pressure detected. Stage 2 Hypertension tracking. Reduce sodium intake and monitor patterns.",
  summary_urdu:
    "بلڈ پریشر کی شرح نارمل حد سے تیز ہے۔ نمک سے مکمل پرہیز کریں، آرام کریں اور باقاعدگی سے چیک کریں۔",
  metrics: [
    {
      id: "systolic",
      name: "Systolic Blood Pressure",
      name_urdu: "سسٹولک بلڈ پریشر (اوپر کا)",
      value: 150,
      unit: "mmHg",
      rangeMin: 90,
      rangeMax: 120,
      status: "high",
      description:
        "Systolic BP is 150 mmHg, above the normal ceiling of 120 mmHg. This falls in the Stage 2 Hypertension range.",
      description_urdu:
        "اوپر کا بلڈ پریشر ۱۵۰ mmHg ہے جو نارمل حد ۱۲۰ سے زیادہ ہے اور ہائی بلڈ پریشر کی علامت ہے۔",
      action:
        "Cut sodium intake drastically, avoid stress, and take prescribed antihypertensive medication consistently.",
      action_urdu:
        "نمک بالکل کم کریں، پریشانی سے بچیں اور ڈاکٹر کی دوائی باقاعدگی سے لیں۔",
    },
    {
      id: "diastolic",
      name: "Diastolic Blood Pressure",
      name_urdu: "ڈائسٹولک بلڈ پریشر (نیچے کا)",
      value: 95,
      unit: "mmHg",
      rangeMin: 60,
      rangeMax: 80,
      status: "high",
      description:
        "Diastolic BP is 95 mmHg, above the normal range of 60–80 mmHg. Sustained diastolic hypertension increases stroke risk.",
      description_urdu:
        "نیچے کا بلڈ پریشر ۹۵ mmHg ہے جو نارمل حد ۶۰–۸۰ سے زیادہ ہے۔ یہ فالج کا خطرہ بڑھاتا ہے۔",
      action:
        "Monitor BP twice daily, avoid caffeine and alcohol, and follow up with your doctor within one week.",
      action_urdu:
        "دن میں دو بار بلڈ پریشر چیک کریں، چائے اور کافی کم کریں اور ایک ہفتے میں ڈاکٹر سے ملیں۔",
    },
  ],
};

// 4. HEART — Tachycardia
const SCENARIO_HEART: AnalysisResult = {
  scenario: "HEART",
  urgency: "attention",
  summary:
    "Tachycardia markers noted. Resting heart rate is elevated above baseline resting bounds.",
  summary_urdu:
    "دل کی دھڑکن کی رفتار (پلس ریٹ) تیز ہے۔ اگر بے چینی یا گھبراہٹ محسوس ہو تو فوری معائنہ کروائیں۔",
  metrics: [
    {
      id: "heart_rate",
      name: "Pulse / Heart Rate",
      name_urdu: "دل کی دھڑکن (پلس ریٹ)",
      value: 110,
      unit: "BPM",
      rangeMin: 60,
      rangeMax: 100,
      status: "high",
      description:
        "Resting heart rate is 110 BPM, above the normal resting range of 60–100 BPM. This may indicate tachycardia or anxiety.",
      description_urdu:
        "دل کی دھڑکن آرام کی حالت میں ۱۱۰ BPM ہے جو نارمل حد ۶۰–۱۰۰ سے زیادہ ہے۔ یہ تناؤ یا دل کی کسی تکلیف کی نشانی ہو سکتی ہے۔",
      action:
        "Rest and avoid stimulants. If palpitations persist or chest pain occurs, seek emergency care immediately.",
      action_urdu:
        "آرام کریں اور چائے، کافی سے پرہیز کریں۔ اگر گھبراہٹ یا سینے میں درد ہو تو فوراً ڈاکٹر کے پاس جائیں۔",
    },
  ],
};

// 5. LIVER — Elevated transaminases
const SCENARIO_LIVER: AnalysisResult = {
  scenario: "LIVER",
  urgency: "attention",
  summary:
    "Elevated hepatic transaminase (ALT/SGPT) levels indicate mild liver cellular inflammation or workload stress.",
  summary_urdu:
    "جگر کے انزائمز (ALT) کی سطح بڑھی ہوئی ہے جو جگر پر ہلکی سوزش یا ورک لوڈ کو ظاہر کرتی ہے۔",
  metrics: [
    {
      id: "sgpt",
      name: "SGPT / ALT",
      name_urdu: "ایس جی پی ٹی / ALT",
      value: 68,
      unit: "U/L",
      rangeMin: 7,
      rangeMax: 56,
      status: "high",
      description:
        "SGPT/ALT is mildly elevated at 68 U/L, above the normal range of 7–56 U/L. This suggests mild hepatic inflammation.",
      description_urdu:
        "جگر کے انزائمز (ALT) ۶۸ U/L ہیں جو نارمل حد ۷–۵۶ سے زیادہ ہیں۔ یہ جگر پر ہلکی سوزش ظاہر کرتے ہیں۔",
      action:
        "Avoid alcohol, fatty foods, and paracetamol overuse. Repeat liver function tests in 4–6 weeks.",
      action_urdu:
        "شراب، چکنائی اور پین کلر دوائیں بند کریں۔ ۴–۶ ہفتوں بعد جگر کے ٹیسٹ دوبارہ کروائیں۔",
    },
    {
      id: "bilirubin",
      name: "Bilirubin Total",
      name_urdu: "کل بلی روبن",
      value: 0.8,
      unit: "mg/dL",
      rangeMin: 0.2,
      rangeMax: 1.2,
      status: "normal",
      description:
        "Bilirubin Total is 0.8 mg/dL, comfortably within the normal reference range of 0.2–1.2 mg/dL.",
      description_urdu:
        "بلی روبن ۰.۸ mg/dL ہے جو نارمل حد ۰.۲–۱.۲ کے اندر ہے۔ کوئی پریشانی نہیں۔",
      action:
        "No action required for bilirubin at this time. Continue routine monitoring.",
      action_urdu:
        "بلی روبن کے لیے فی الحال کسی اقدام کی ضرورت نہیں۔ معمول کی جانچ جاری رکھیں۔",
    },
  ],
};

// ─── Demo Scenario A: Default / Vitamin D + Hemoglobin ───────────────────────
const SCENARIO_A: AnalysisResult = {
  scenario: "A",
  urgency: "attention",
  summary:
    "Severe Vitamin D3 deficiency detected along with mild down-trending Hemoglobin levels.",
  summary_urdu:
    "وٹامن ڈی کی بہت زیادہ کمی ہے اور ہیموگلوبن کی مقدار نارمل حد سے تھوڑی نیچے ہے۔",
  metrics: [
    {
      id: "vitd3",
      name: "Vitamin D3",
      name_urdu: "وٹامن ڈی تھری",
      value: 12.4,
      unit: "ng/mL",
      rangeMin: 30,
      rangeMax: 100,
      status: "low",
      description:
        "Vitamin D3 is significantly below the optimal range of 30–100 ng/mL. Deficiency impairs bone health and immune function.",
      description_urdu:
        "وٹامن ڈی تھری کی مقدار بہت کم ہے، معیاری حد ۳۰ سے ۱۰۰ ng/mL سے بہت نیچے ہے۔",
      action:
        "Take Vitamin D3 supplements as prescribed by your doctor. Get adequate sunlight and include fortified foods.",
      action_urdu:
        "ڈاکٹر کی ہدایت پر وٹامن ڈی کی گولیاں لیں، دھوپ میں بیٹھیں اور مضبوط غذائیں کھائیں۔",
    },
    {
      id: "hgb",
      name: "Hemoglobin",
      name_urdu: "ہیموگلوبن",
      value: 11.2,
      unit: "g/dL",
      rangeMin: 13.5,
      rangeMax: 17.5,
      status: "low",
      description:
        "Hemoglobin is below the normal range of 13.5–17.5 g/dL, indicating mild anemia. Follow-up evaluation is advisable.",
      description_urdu:
        "ہیموگلوبن نارمل حد ۱۳.۵–۱۷.۵ g/dL سے کم ہے جو ہلکی خون کی کمی کی علامت ہے۔",
      action:
        "Increase iron-rich foods (meat, leafy greens, lentils). Your doctor may recommend iron supplements.",
      action_urdu:
        "گوشت، پالک اور دالیں زیادہ کھائیں۔ ڈاکٹر آئرن کی گولیاں بھی تجویز کر سکتے ہیں۔",
    },
    {
      id: "fglucose",
      name: "Fasting Glucose",
      name_urdu: "خالی پیٹ شوگر",
      value: 94,
      unit: "mg/dL",
      rangeMin: 70,
      rangeMax: 100,
      status: "normal",
      description:
        "Fasting Glucose is within the healthy reference range of 70–100 mg/dL. No action required.",
      description_urdu:
        "خالی پیٹ شوگر بالکل نارمل ہے، ۷۰ سے ۱۰۰ mg/dL کی حد کے اندر ہے۔",
      action: "Maintain your current diet and lifestyle. No intervention needed.",
      action_urdu: "اپنی موجودہ خوراک اور طرزِ زندگی برقرار رکھیں۔ کوئی اقدام ضروری نہیں۔",
    },
  ],
};

// ─── Demo Scenario B: Critical (High Glucose + WBC) ──────────────────────────
const SCENARIO_B: AnalysisResult = {
  scenario: "B",
  urgency: "critical",
  summary:
    "CRITICAL: Fasting Glucose and WBC Count are dangerously outside the normal range. Immediate medical consultation is strongly advised.",
  summary_urdu:
    "خطرناک: خالی پیٹ شوگر اور سفید خون کے خلیے خطرناک حد تک زیادہ ہیں۔ فوری طور پر ڈاکٹر سے ملنا بہت ضروری ہے۔",
  metrics: [
    {
      id: "fglucose_b",
      name: "Fasting Glucose",
      name_urdu: "خالی پیٹ شوگر",
      value: 240,
      unit: "mg/dL",
      rangeMin: 70,
      rangeMax: 100,
      status: "critical",
      description:
        "Fasting Glucose is critically elevated at 240 mg/dL, far exceeding the normal range of 70–100 mg/dL. Indicates uncontrolled diabetes.",
      description_urdu:
        "خالی پیٹ شوگر ۲۴۰ mg/dL ہے جو نارمل حد سے بہت زیادہ ہے۔ یہ بے قابو ذیابیطس کی علامت ہے۔",
      action:
        "Seek immediate medical attention. Adjust insulin or oral hypoglycemic therapy as directed.",
      action_urdu:
        "فوری ڈاکٹر سے ملیں۔ انسولین یا شوگر کی دوائی کے بارے میں مشورہ لیں اور میٹھی اشیاء بند کریں۔",
    },
    {
      id: "wbc",
      name: "WBC Count",
      name_urdu: "سفید خون کے خلیے",
      value: 22.4,
      unit: "×10³/µL",
      rangeMin: 4.5,
      rangeMax: 11.0,
      status: "high",
      description:
        "WBC Count is critically elevated at 22.4 ×10³/µL, well above the normal range of 4.5–11.0. May signal severe infection.",
      description_urdu:
        "سفید خون کے خلیے ۲۲.۴ ×10³/µL ہیں جو نارمل حد سے بہت زیادہ ہیں۔ یہ کسی شدید انفیکشن کی نشانی ہو سکتی ہے۔",
      action:
        "Urgent blood culture and complete sepsis workup may be required. Consult immediately.",
      action_urdu:
        "خون کا مکمل ٹیسٹ فوری کروائیں اور ڈاکٹر کے ساتھ فوری ملیں۔",
    },
    {
      id: "hgb_b",
      name: "Hemoglobin",
      name_urdu: "ہیموگلوبن",
      value: 13.8,
      unit: "g/dL",
      rangeMin: 13.5,
      rangeMax: 17.5,
      status: "normal",
      description:
        "Hemoglobin is within the normal reference range of 13.5–17.5 g/dL. No concerns noted.",
      description_urdu:
        "ہیموگلوبن نارمل حد کے اندر ہے۔ اس قدر میں کوئی پریشانی نہیں۔",
      action: "No action required. Continue routine check-ups.",
      action_urdu: "کوئی اقدام ضروری نہیں۔ معمول کے معائنے جاری رکھیں۔",
    },
    {
      id: "vitd3_b",
      name: "Vitamin D3",
      name_urdu: "وٹامن ڈی تھری",
      value: 45.0,
      unit: "ng/mL",
      rangeMin: 30,
      rangeMax: 100,
      status: "normal",
      description:
        "Vitamin D3 is within the adequate range of 30–100 ng/mL. Current levels are satisfactory.",
      description_urdu:
        "وٹامن ڈی تھری نارمل حد کے اندر ہے۔ کوئی کمی نہیں۔",
      action: "Maintain current supplementation if any. No changes needed.",
      action_urdu: "موجودہ سپلیمنٹ جاری رکھیں اگر لے رہے ہیں۔ کوئی تبدیلی ضروری نہیں۔",
    },
  ],
};

// ─── Demo Scenario C: All Normal ─────────────────────────────────────────────
const SCENARIO_C: AnalysisResult = {
  scenario: "C",
  urgency: "normal",
  summary:
    "All values are within normal reference ranges. Your lab report shows a clean bill of health — excellent results!",
  summary_urdu:
    "تمام قدریں نارمل حد کے اندر ہیں۔ آپ کی رپورٹ بالکل ٹھیک ہے — بہت اچھا نتیجہ!",
  metrics: [
    {
      id: "vitd3_c",
      name: "Vitamin D3",
      name_urdu: "وٹامن ڈی تھری",
      value: 58.0,
      unit: "ng/mL",
      rangeMin: 30,
      rangeMax: 100,
      status: "normal",
      description:
        "Vitamin D3 is at a healthy 58.0 ng/mL within the optimal range. No supplementation needed.",
      description_urdu:
        "وٹامن ڈی تھری نارمل ۵۸.۰ ng/mL پر ہے۔ کسی سپلیمنٹ کی ضرورت نہیں۔",
      action: "Keep up your diet and sun exposure. No changes needed.",
      action_urdu: "اپنی غذا اور دھوپ کی عادت برقرار رکھیں۔",
    },
    {
      id: "hgb_c",
      name: "Hemoglobin",
      name_urdu: "ہیموگلوبن",
      value: 15.4,
      unit: "g/dL",
      rangeMin: 13.5,
      rangeMax: 17.5,
      status: "normal",
      description:
        "Hemoglobin is at a healthy 15.4 g/dL, well within the reference range.",
      description_urdu:
        "ہیموگلوبن ۱۵.۴ g/dL ہے جو نارمل اور اچھی صحت کی علامت ہے۔",
      action: "No action required. Maintain a balanced diet rich in iron.",
      action_urdu: "کوئی اقدام ضروری نہیں۔ متوازن غذا جاری رکھیں۔",
    },
    {
      id: "fglucose_c",
      name: "Fasting Glucose",
      name_urdu: "خالی پیٹ شوگر",
      value: 88,
      unit: "mg/dL",
      rangeMin: 70,
      rangeMax: 100,
      status: "normal",
      description:
        "Fasting Glucose is 88 mg/dL — comfortably in the healthy range. Blood sugar regulation is excellent.",
      description_urdu:
        "خالی پیٹ شوگر ۸۸ mg/dL ہے جو نارمل حد میں بالکل ٹھیک ہے۔",
      action: "Maintain your current dietary habits. No intervention needed.",
      action_urdu: "اپنی موجودہ خوراک کی عادات برقرار رکھیں۔",
    },
    {
      id: "wbc_c",
      name: "WBC Count",
      name_urdu: "سفید خون کے خلیے",
      value: 6.8,
      unit: "×10³/µL",
      rangeMin: 4.5,
      rangeMax: 11.0,
      status: "normal",
      description:
        "WBC Count of 6.8 ×10³/µL is within the healthy range. No signs of infection.",
      description_urdu:
        "سفید خون کے خلیے ۶.۸ ×10³/µL نارمل ہیں۔ کوئی انفیکشن نہیں۔",
      action: "No action required. Continue routine annual blood work.",
      action_urdu: "کوئی اقدام ضروری نہیں۔ سالانہ خون کا ٹیسٹ کرواتے رہیں۔",
    },
  ],
};

// ─── Scenario registry ────────────────────────────────────────────────────────

const SCENARIOS: Record<ScenarioKey, AnalysisResult> = {
  A: SCENARIO_A,
  B: SCENARIO_B,
  C: SCENARIO_C,
  LIPID: SCENARIO_LIPID,
  GLUCOSE: SCENARIO_GLUCOSE,
  BP: SCENARIO_BP,
  HEART: SCENARIO_HEART,
  LIVER: SCENARIO_LIVER,
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Simulates an AI analysis call with exactly 2500 ms latency.
 *
 * Routing logic:
 *   1. If `uploadedText` is provided and matches a clinical keyword pattern,
 *      the corresponding dynamic scenario is returned regardless of `scenario`.
 *   2. Otherwise the selected demo scenario (A / B / C) is returned.
 *
 * Always returns a deep-copied payload to prevent accidental mutation.
 */
export async function analyzeReport(
  scenario: Scenario,
  uploadedText?: string
): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const detectedKey =
        uploadedText ? detectScenario(uploadedText) : null;

      const key: ScenarioKey = detectedKey ?? scenario;
      const payload = SCENARIOS[key];

      // Deep-copy + auto-sort by severity before returning
      const result: AnalysisResult = JSON.parse(JSON.stringify(payload));
      result.metrics = sortMetricsBySeverity(result.metrics);

      resolve(result);
    }, 2500);
  });
}

/**
 * Utility: reads a File object as plain text.
 * Returns an empty string on failure so the caller degrades gracefully.
 * Works for .txt, .csv files and PDF text layers.
 * Binary image files produce empty/garbled output — pattern matching
 * simply won't trigger, which is the expected fallback behaviour.
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

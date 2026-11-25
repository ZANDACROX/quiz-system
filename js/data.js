/* ===== Shared helpers, settings and default questions ===== */
const $ = id => document.getElementById(id);

const ADMIN = { username: "admin", password: "admin123" };
const QUIZ  = { topic: "First-Year B.Tech Engineering Basics (Physics, Maths & Basic Engineering)", minutes: 15, perPage: 20 };

const DB = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

const DEFAULT_QUESTIONS = [
  { id: 1,  q: "What is the SI unit of force?", options: ["Joule", "Newton", "Pascal", "Watt"], answer: 1 },
  { id: 2,  q: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], answer: 0 },
  { id: 3,  q: "Ohm's law states that:", options: ["V = I / R", "V = I × R", "I = V × R", "R = V × I"], answer: 1 },
  { id: 4,  q: "What is ∫ 2x dx?", options: ["x + C", "2x² + C", "x² + C", "2 + C"], answer: 2 },
  { id: 5,  q: "The approximate value of acceleration due to gravity on Earth is:", options: ["9.8 m/s²", "1.6 m/s²", "98 m/s²", "0.98 m/s²"], answer: 0 },
  { id: 6,  q: "Which device converts AC into DC?", options: ["Transformer", "Rectifier", "Inverter", "Capacitor"], answer: 1 },
  { id: 7,  q: "In a right-angled triangle with sides 3 and 4, the hypotenuse is:", options: ["5", "6", "7", "25"], answer: 0 },
  { id: 8,  q: "Which of the following is a scalar quantity?", options: ["Velocity", "Force", "Displacement", "Speed"], answer: 3 },
  { id: 9,  q: "Which of these is a good electrical conductor?", options: ["Rubber", "Glass", "Copper", "Wood"], answer: 2 },
  { id: 10, q: "Newton's first law of motion is also known as the law of:", options: ["Inertia", "Momentum", "Gravitation", "Energy"], answer: 0 }
];

function getQuestions() {
  let q = DB.get("qms_questions", null);
  if (!q) { q = DEFAULT_QUESTIONS; DB.set("qms_questions", q); }
  return q;
}
const saveQuestions = q => DB.set("qms_questions", q);
const getUsers   = () => DB.get("qms_users", []);
const saveUsers  = u => DB.set("qms_users", u);
const getResults = () => DB.get("qms_results", []);
const saveResults = r => DB.set("qms_results", r);

/* ===== Session (cleared when the tab closes) ===== */
const getSession = () => { try { return JSON.parse(sessionStorage.getItem("qms_session")); } catch (e) { return null; } };
const setSession = s => sessionStorage.setItem("qms_session", JSON.stringify(s));

function requireRole(role) {
  const s = getSession();
  if (!s || s.role !== role) { location.replace("index.html"); return null; }
  return s;
}
function logout() {
  sessionStorage.clear();
  location.href = "index.html";
}
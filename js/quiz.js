const session = requireRole("student");
const questions = getQuestions();
const end = Number(sessionStorage.getItem("qms_end"));

if (session) {
  if (!end || !questions.length) location.replace("student.html");
  else init();
}

function init() {
  const pages = Math.ceil(questions.length / QUIZ.perPage);
  let page = 0, submitted = false;
  const answers = JSON.parse(sessionStorage.getItem("qms_answers") || "{}");
  const box = $("questions"), timerEl = $("timer"), prev = $("prev"), next = $("next"), submitBtn = $("submit");

  function render() {
    box.innerHTML = "";
    const start = page * QUIZ.perPage;
    questions.slice(start, start + QUIZ.perPage).forEach((q, i) => {
      const div = document.createElement("div"); div.className = "q";
      const p = document.createElement("p"); p.textContent = `${start + i + 1}. ${q.q}`; div.appendChild(p);
      q.options.forEach((o, idx) => {
        const l = document.createElement("label"); l.className = "opt";
        const r = document.createElement("input");
        r.type = "radio"; r.name = "q" + q.id; r.checked = answers[q.id] === idx;
        r.onchange = () => { answers[q.id] = idx; sessionStorage.setItem("qms_answers", JSON.stringify(answers)); };
        l.append(r, document.createTextNode(o)); div.appendChild(l);
      });
      box.appendChild(div);
    });
    $("pageInfo").textContent = `Page ${page + 1} of ${pages}`;
    prev.classList.toggle("hidden", pages === 1);
    prev.disabled = page === 0;
    next.classList.toggle("hidden", page === pages - 1);
    submitBtn.classList.toggle("hidden", page !== pages - 1);
    window.scrollTo(0, 0);
  }

  function finish(auto) {
    if (submitted) return;
    const unanswered = questions.filter(q => answers[q.id] === undefined).length;
    if (!auto && unanswered && !confirm(`${unanswered} question(s) unanswered. Submit anyway?`)) return;
    submitted = true; clearInterval(iv);

    let score = 0;
    const review = questions.map(q => {
      const ok = answers[q.id] === q.answer; if (ok) score++;
      return { q: q.q, your: answers[q.id] === undefined ? "Not answered" : q.options[answers[q.id]], correct: q.options[q.answer], ok };
    });
    const total = questions.length;
    const pct = Math.round(score / total * 1000) / 10;
    const status = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Average" : "Needs Improvement";
    const used = Math.min(QUIZ.minutes * 60, Math.round((Date.now() - (end - QUIZ.minutes * 60000)) / 1000));
    const summary = { name: session.name, username: session.username, score, total, pct, status, used, date: new Date().toLocaleString() };

    const all = getResults(); all.push(summary); saveResults(all);
    sessionStorage.setItem("qms_last", JSON.stringify({ ...summary, review }));
    sessionStorage.removeItem("qms_end");
    sessionStorage.removeItem("qms_answers");
    location.href = "result.html";
  }

  function tick() {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    timerEl.textContent = `⏱ ${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
    timerEl.classList.toggle("warn", left <= 60);
    if (left === 0) finish(true);
  }

  prev.onclick = () => { if (page > 0) { page--; render(); } };
  next.onclick = () => { if (page < pages - 1) { page++; render(); } };
  submitBtn.onclick = () => finish(false);

  const iv = setInterval(tick, 500);
  render();
  tick();
}
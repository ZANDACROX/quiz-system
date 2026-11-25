const session = requireRole("student");
if (session) {
  $("who").textContent = "👤 " + session.name;
  $("logout").onclick = logout;

  const qs = getQuestions();
  $("topic").textContent = QUIZ.topic;
  $("info").textContent = `${qs.length} questions • ${QUIZ.minutes} minutes • ${Math.max(1, Math.ceil(qs.length / QUIZ.perPage))} page(s)`;

  const btn = $("start");
  if (!qs.length) { btn.disabled = true; $("info").textContent = "No questions available yet. Please contact the admin."; }
  btn.onclick = () => {
    sessionStorage.setItem("qms_end", String(Date.now() + QUIZ.minutes * 60000));
    sessionStorage.removeItem("qms_answers");
    sessionStorage.removeItem("qms_last");
    location.href = "quiz.html";
  };

  const mine = getResults().filter(r => r.username === session.username).reverse();
  const body = $("history");
  if (!mine.length) body.innerHTML = '<tr><td colspan="4" class="muted">No attempts yet.</td></tr>';
  mine.forEach(r => {
    const tr = document.createElement("tr");
    [r.date, `${r.score}/${r.total}`, r.pct + "%", r.status].forEach(t => {
      const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}
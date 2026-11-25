if (requireRole("admin")) {
  $("logout").onclick = logout;
  let questions = getQuestions();
  let editingId = null;
  const opts = [$("o0"), $("o1"), $("o2"), $("o3")];
  const msg = $("msg");
  const say = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };
  const cell = (tr, text) => { const td = document.createElement("td"); td.textContent = text; tr.appendChild(td); return td; };

  function renderQuestions() {
    $("count").textContent = questions.length;
    const body = $("qBody"); body.innerHTML = "";
    if (!questions.length) body.innerHTML = '<tr><td colspan="5" class="muted">No questions. Add one below.</td></tr>';
    questions.forEach((q, i) => {
      const tr = document.createElement("tr");
      cell(tr, i + 1);
      cell(tr, q.q);
      cell(tr, q.options.map((o, k) => "ABCD"[k] + ") " + o).join("  |  "));
      cell(tr, "ABCD"[q.answer]);
      const act = document.createElement("td");
      const e = document.createElement("button"); e.className = "btn small"; e.textContent = "Edit";
      e.onclick = () => startEdit(q);
      const d = document.createElement("button"); d.className = "btn danger small"; d.textContent = "Delete"; d.style.marginLeft = "4px";
      d.onclick = () => { if (confirm("Delete this question?")) { questions = questions.filter(x => x.id !== q.id); saveQuestions(questions); if (editingId === q.id) clearForm(); renderQuestions(); } };
      act.append(e, d); tr.appendChild(act);
      body.appendChild(tr);
    });
  }

  function startEdit(q) {
    editingId = q.id;
    $("qText").value = q.q;
    opts.forEach((o, i) => o.value = q.options[i]);
    $("qAns").value = q.answer;
    $("formTitle").textContent = "Edit Question";
    $("cancelEdit").classList.remove("hidden");
    msg.className = "msg";
    $("qText").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearForm() {
    editingId = null;
    $("qText").value = ""; opts.forEach(o => o.value = ""); $("qAns").value = "0";
    $("formTitle").textContent = "Add New Question";
    $("cancelEdit").classList.add("hidden");
  }

  $("saveQ").onclick = () => {
    const text = $("qText").value.trim();
    const options = opts.map(o => o.value.trim());
    if (!text || options.some(o => !o)) return say("Enter the question and all four options.");
    const answer = Number($("qAns").value);
    if (editingId !== null) {
      questions = questions.map(q => q.id === editingId ? { id: q.id, q: text, options, answer } : q);
      say("Question updated.", true);
    } else {
      questions.push({ id: Date.now(), q: text, options, answer });
      say("Question added.", true);
    }
    saveQuestions(questions);
    const keep = msg.textContent; clearForm(); say(keep, true);
    renderQuestions();
  };
  $("cancelEdit").onclick = () => { clearForm(); msg.className = "msg"; };
  $("resetQ").onclick = () => {
    if (confirm("Replace all questions with the 10 default ones?")) {
      questions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)); saveQuestions(questions); clearForm(); renderQuestions();
    }
  };

  function renderResults() {
    const body = $("rBody"); body.innerHTML = "";
    const all = getResults().slice().reverse();
    if (!all.length) body.innerHTML = '<tr><td colspan="5" class="muted">No attempts yet.</td></tr>';
    all.forEach(r => {
      const tr = document.createElement("tr");
      [r.date, `${r.name} (${r.username})`, `${r.score}/${r.total}`, r.pct + "%", r.status].forEach(t => cell(tr, t));
      body.appendChild(tr);
    });
  }
  $("clearR").onclick = () => { if (confirm("Delete all stored results?")) { saveResults([]); renderResults(); } };

  renderQuestions();
  renderResults();
}
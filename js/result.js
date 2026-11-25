const session = requireRole("student");
if (session) {
  $("logout").onclick = logout;
  let r = null;
  try { r = JSON.parse(sessionStorage.getItem("qms_last")); } catch (e) {}
  if (!r) location.replace("student.html");
  else {
    $("title").textContent = `Well done, ${r.name}!`;
    $("marks").textContent = `${r.score} / ${r.total}`;
    $("pct").textContent = r.pct + "%";
    $("status").textContent = r.status;
    $("time").textContent = `${Math.floor(r.used / 60)}m ${r.used % 60}s`;
    const body = $("review");
    r.review.forEach((x, i) => {
      const tr = document.createElement("tr");
      [i + 1, x.q, x.your, x.correct].forEach((t, c) => {
        const td = document.createElement("td"); td.textContent = t;
        if (c === 2) td.className = x.ok ? "right" : "wrong";
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }
}
/* ===== Login / Register logic ===== */
(function () {
  const s = getSession();
  if (s) { location.replace(s.role === "admin" ? "admin.html" : "student.html"); return; }

  const tabs = document.querySelectorAll(".tab");
  const forms = ["studentLogin", "studentRegister", "adminLogin"];
  const msg = $("msg");
  const say = (t, ok) => { msg.textContent = t; msg.className = "msg " + (ok ? "ok" : "err"); };

  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("active", x === t));
    forms.forEach(f => $(f).classList.toggle("hidden", f !== t.dataset.form));
    msg.className = "msg";
  }));

  $("studentRegister").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("regName").value.trim();
    const user = $("regUser").value.trim().toLowerCase();
    const pass = $("regPass").value;
    if (!name || !user || pass.length < 4) return say("Fill all fields (password min 4 characters).");
    if (user === ADMIN.username) return say("That username is reserved.");
    const users = getUsers();
    if (users.some(u => u.username === user)) return say("Username already taken.");
    users.push({ name, username: user, password: pass });
    saveUsers(users);
    e.target.reset();
    tabs[0].click();
    say("Registered successfully! Please log in.", true);
  });

  $("studentLogin").addEventListener("submit", e => {
    e.preventDefault();
    const user = $("slUser").value.trim().toLowerCase();
    const pass = $("slPass").value;
    const found = getUsers().find(u => u.username === user && u.password === pass);
    if (!found) return say("Invalid username or password. New here? Register first.");
    setSession({ role: "student", username: found.username, name: found.name });
    location.href = "student.html";
  });

  $("adminLogin").addEventListener("submit", e => {
    e.preventDefault();
    if ($("alUser").value.trim() === ADMIN.username && $("alPass").value === ADMIN.password) {
      setSession({ role: "admin", username: ADMIN.username, name: "Administrator" });
      location.href = "admin.html";
    } else say("Invalid admin credentials.");
  });
})();
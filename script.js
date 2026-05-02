let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

let xp = parseInt(localStorage.getItem("xp")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

/* SUBJECT BANK */
const topicBank = {
  DBMS: [
    { name: "Normalization", importance: 3, done: false },
    { name: "SQL Queries", importance: 3, done: false },
    { name: "ER Diagram", importance: 2, done: false },
    { name: "Transactions", importance: 3, done: false }
  ],
  OS: [
    { name: "Deadlocks", importance: 3, done: false },
    { name: "Scheduling", importance: 3, done: false },
    { name: "Memory Management", importance: 2, done: false }
  ],
  MATH: [
    { name: "Matrices", importance: 3, done: false },
    { name: "Probability", importance: 2, done: false },
    { name: "Calculus", importance: 3, done: false }
  ],
  CN: [
    { name: "OSI Model", importance: 3, done: false },
    { name: "TCP/IP", importance: 3, done: false },
    { name: "Subnetting", importance: 3, done: false }
  ],
  PYTHON: [
    { name: "Loops", importance: 2, done: false },
    { name: "Functions", importance: 2, done: false }
  ],
  AI: [
    { name: "ML Basics", importance: 3, done: false },
    { name: "Neural Networks", importance: 3, done: false }
  ]
};

/* NAV */
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* SAVE */
function saveSubjects() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

/* ADD SUBJECT */
function addSubject() {
  let name = document.getElementById("subject").value.trim().toUpperCase();
  let date = document.getElementById("examDate").value;

  if (!topicBank[name] || !date) {
    alert("Enter valid subject");
    return;
  }

  subjects.push({
    name,
    examDate: date,
    topics: topicBank[name].map(t => ({ ...t }))
  });

  saveSubjects();
  renderAll();

  document.getElementById("subject").value = "";
  document.getElementById("examDate").value = "";
}

/* DELETE SUBJECT */
function deleteSubject(index) {
  subjects.splice(index, 1);
  saveSubjects();
  renderAll();
}

/* TOGGLE TOPIC DONE */
function toggleTopic(sIndex, tIndex) {
  subjects[sIndex].topics[tIndex].done = !subjects[sIndex].topics[tIndex].done;

  if (subjects[sIndex].topics[tIndex].done) xp += 10;

  localStorage.setItem("xp", xp);

  saveSubjects();
  renderAll();
}

/* TODAY PLAN */
function generateTodayPlan() {
  let box = document.getElementById("todayPlan");
  box.innerHTML = "";

  subjects.forEach(s => {
    let pending = s.topics.filter(t => !t.done);

    let div = document.createElement("div");
    div.className = "progress-card";

    div.innerHTML = `
      <h3>${s.name}</h3>
      <p>${pending.map(t => t.name).join(", ")}</p>
    `;

    box.appendChild(div);
  });
}

/* SUBJECT LIST */
function displaySubjects() {
  let box = document.getElementById("subjectList");
  box.innerHTML = "";

  subjects.forEach((s, i) => {
    let div = document.createElement("div");
    div.className = "progress-card";

    div.innerHTML = `
      <h3>${s.name}</h3>
      <p>${s.examDate}</p>

      ${s.topics.map((t, j) => `
        <label>
          <input type="checkbox" ${t.done ? "checked" : ""}
          onchange="toggleTopic(${i},${j})">
          ${t.name}
        </label>
      `).join("")}

      <button onclick="deleteSubject(${i})">Delete Subject</button>
    `;

    box.appendChild(div);
  });
}

/* PROGRESS DASHBOARD */
function generateProgress() {
  let box = document.getElementById("progressContainer");
  box.innerHTML = "";

  subjects.forEach(s => {
    let total = s.topics.length;
    let done = s.topics.filter(t => t.done).length;
    let percent = total ? Math.round((done / total) * 100) : 0;

    box.innerHTML += `
      <div class="progress-card">
        <h3>${s.name}</h3>
        <p>${percent}% completed</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });
}

/* STATS */
function showStats() {
  document.getElementById("statsBox").innerHTML = `
    <div class="progress-card">
      <h3>XP</h3>
      <p>${xp}</p>
    </div>

    <div class="progress-card">
      <h3>Subjects</h3>
      <p>${subjects.length}</p>
    </div>
  `;
}

/* TIMER */
let timer;
let time = 1500;

function updateTimer() {
  let m = Math.floor(time / 60);
  let s = time % 60;
  document.getElementById("timerDisplay").innerText =
    `${m}:${s < 10 ? "0" : ""}${s}`;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  time = 1500;
  updateTimer();
}

/* INIT */
function renderAll() {
  saveSubjects();
  displaySubjects();
  generateTodayPlan();
  generateProgress();
  showStats();
}

renderAll();
updateTimer();
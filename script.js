let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

let xp = parseInt(localStorage.getItem("xp")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastActive = localStorage.getItem("lastActive") || null;

let examMode = false;

/* Topic Bank */
const topicBank = {
  DBMS: [
    { name: "Normalization", importance: 3, done: false },
    { name: "SQL Queries", importance: 3, done: false },
    { name: "ER Diagram", importance: 2, done: false },
    { name: "Transactions", importance: 3, done: false }
  ],
  Math: [
    { name: "Matrices", importance: 3, done: false },
    { name: "Probability", importance: 2, done: false },
    { name: "Calculus", importance: 3, done: false }
  ],
  OS: [
    { name: "Deadlocks", importance: 3, done: false },
    { name: "Scheduling", importance: 3, done: false },
    { name: "Memory Management", importance: 2, done: false }
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

/* XP */
function addXP(val) {
  xp += val;
  localStorage.setItem("xp", xp);
}

/* STREAK */
function updateStreak() {
  let today = new Date().toDateString();

  if (lastActive !== today) {
    let y = new Date();
    y.setDate(y.getDate() - 1);

    if (lastActive === y.toDateString()) streak++;
    else streak = 1;

    lastActive = today;

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastActive", lastActive);
  }
}

/* ADD SUBJECT */
function addSubject() {
  let name = document.getElementById("subject").value.trim();
  let date = document.getElementById("examDate").value;

  if (!topicBank[name] || !date) {
    alert("Invalid input");
    return;
  }

  subjects.push({
    name,
    examDate: date,
    topics: topicBank[name].map(t => ({ ...t }))
  });

  saveSubjects();
  renderAll();
}

/* SMART SCHEDULER */
function calculateDailyPlan(subject) {
  let today = new Date();
  let examDate = new Date(subject.examDate);

  let daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 1) daysLeft = 1;

  let pending = subject.topics.filter(t => !t.done);

  pending.forEach(t => {
    t.dynamicPriority = t.importance + 1;
  });

  pending.sort((a, b) => b.dynamicPriority - a.dynamicPriority);

  let perDay = Math.ceil(pending.length / daysLeft);

  return pending.slice(0, perDay);
}

/* TODAY PLAN */
function generateTodayPlan() {
  let box = document.getElementById("todayPlan");
  box.innerHTML = "";

  subjects.forEach(s => {
    let tasks = calculateDailyPlan(s);

    let div = document.createElement("div");
    div.className = "plan-card";

    div.innerHTML = `
      <h3>${s.name}</h3>
      <ul>
        ${tasks.map(t => `<li>${t.name} (P${t.importance})</li>`).join("")}
      </ul>
    `;

    box.appendChild(div);
  });
}

/* PROGRESS */
function generateProgress() {
  let box = document.getElementById("progressContainer");
  box.innerHTML = "";

  subjects.forEach(s => {
    let total = s.topics.length;
    let done = s.topics.filter(t => t.done).length;
    let percent = Math.round((done / total) * 100);

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

/* WEAK TOPICS */
function getWeakTopics() {
  let arr = [];

  subjects.forEach(s => {
    s.topics.forEach(t => {
      if (!t.done && t.importance === 3) {
        arr.push(`${s.name} - ${t.name}`);
      }
    });
  });

  return arr;
}

/* STATS */
function showStats() {
  document.getElementById("statsBox").innerHTML = `
    <div class="progress-card">
      <h3> Streak</h3>
      <p>${streak} days</p>
    </div>

    <div class="progress-card">
      <h3> XP</h3>
      <p>${xp}</p>
    </div>

    <div class="progress-card">
      <h3> Weak Topics</h3>
      <p>${getWeakTopics().join(", ") || "All good!"}</p>
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

/* RENDER */
function renderAll() {
  saveSubjects();
  generateProgress();
  generateTodayPlan();
  showStats();
  updateStreak();
}

/* INIT */
renderAll();
updateTimer();
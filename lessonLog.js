// ────────────────────────────
//  Lesson‑for‑young‑devs Logger
//  by Lord Hassan, July‑2025
// ────────────────────────────
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 1) File paths
const jsonPath = path.join(__dirname, "data", "lessons.json");
const mdPath = path.join(__dirname, "README.md");

// 2) Handy wrappers
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (q) =>
  new Promise((res) => rl.question(q, (ans) => res(ans.trim())));

// 3) Make sure folders & files exist
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
if (!fs.existsSync(jsonPath) || fs.readFileSync(jsonPath).length === 0) {
  fs.writeFileSync(jsonPath, "[]");
}

// Markdown header block for the lessons table
const headerBlock = `## 🛠️ Developer Struggles & Real Lessons

| S/N | Struggle / Pattern | 🔥 Inspiring YouTube Link | 📖 Blog / Notes | 🧠 What To Do Instead |
|-----|--------------------|--------------------------|-----------------|-----------------------|
`;

// Seed README if missing or if header not present
if (!fs.existsSync(mdPath)) {
  fs.writeFileSync(mdPath, "# Lesson‑for‑young‑devs\n\n" + headerBlock);
} else {
  const md = fs.readFileSync(mdPath, "utf8");
  if (!md.includes("| S/N | Struggle")) {
    fs.appendFileSync(mdPath, "\n" + headerBlock);
  }
}

// 4) Main async flow
(async function run() {
  console.log("\n📚  New Lesson Entry\n");

  const struggle = await ask("😰 Struggle / Pattern: ");
  const ytLink = await ask("🔥 YouTube Link (optional, press Enter to skip): ");
  const blogLink = await ask(
    "📖 Blog / Notes (optional, press Enter to skip): "
  );
  const remedy = await ask("🧠 What To Do Instead: ");
  rl.close();

  // --- Load or create JSON array ---
  let lessons;
  try {
    lessons = JSON.parse(fs.readFileSync(jsonPath));
    if (!Array.isArray(lessons)) lessons = [];
  } catch {
    lessons = [];
  }

  const sn = lessons.length + 1;
  const date = new Date().toISOString().slice(0, 10); // stored but not shown
  const entry = { sn, date, struggle, ytLink, blogLink, remedy };
  lessons.push(entry);
  fs.writeFileSync(jsonPath, JSON.stringify(lessons, null, 2));

  // --- Append Markdown row ---
  // Format links if they exist
  const ytDisplay = ytLink ? `[Watch](${ytLink})` : "-";
  const blogDisplay = blogLink ? `[Read](${blogLink})` : "-";

  const mdRow = `| ${sn} | ${
    struggle || "-"
  } | ${ytDisplay} | ${blogDisplay} | ${remedy || "-"} |\n`;

  fs.appendFileSync(mdPath, mdRow);

  console.log(
    "\n✅ Lesson saved to README and JSON. Push your changes to share the wisdom!\n"
  );
})();

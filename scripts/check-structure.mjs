#!/usr/bin/env node

import { access, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");

const requiredFiles = [
  "README.md",
  "START_HERE.md",
  "AGENTS.md",
  "PROGRESS.md",
  "learn",
  "compose.yml",
  ".agents/skills/explain-code-precisely/SKILL.md",
  ".agents/skills/explain-code-precisely/references/terms.md",
  "docs/codex/start-prompt.txt",
  "frontend/src/App.jsx",
  "frontend/src/api/tasks.js",
  "frontend/src/components/TaskForm.jsx",
  "frontend/src/components/LearningTrace.jsx",
  "backend/config/routes.rb",
  "backend/app/controllers/api/v1/tasks_controller.rb",
  "backend/app/models/task.rb",
  "docs/visual-lab/index.html",
  "docs/visuals/00-course-map.svg",
  "docs/visuals/04-network-log-xray.svg",
  "docs/visuals/05-priority-vertical-slice.svg",
  "exercises/01-javascript/tasks.mjs",
  "quiz/questions.json",
];

const lessonNames = [
  "00-start.md",
  "01-javascript.md",
  "02-react-components.md",
  "03-react-state.md",
  "04-rails-request.md",
  "05-rails-database.md",
  "06-connect.md",
  "07-priority-feature.md",
  "08-debug-internship.md",
];

for (const name of lessonNames) requiredFiles.push(`docs/lessons/${name}`);

const failures = [];
for (const relativePath of requiredFiles) {
  try {
    await access(resolve(root, relativePath));
  } catch {
    failures.push(`見つからない: ${relativePath}`);
  }
}

try {
  const learnStat = await stat(resolve(root, "learn"));
  if ((learnStat.mode & 0o111) === 0) failures.push("learn に実行権限がない");
} catch {
  // 欠落は前段で報告済み
}

try {
  const readme = await readFile(resolve(root, "README.md"), "utf8");
  if (!readme.includes("./learn")) failures.push("READMEに単一入口 ./learn がない");

  for (const forbidden of ["docker compose up", "npm run dev", "rails server"]) {
    if (readme.includes(forbidden)) failures.push(`READMEに別の起動経路がある: ${forbidden}`);
  }
} catch {
  // 欠落は前段で報告済み
}

try {
  const skill = await readFile(
    resolve(root, ".agents/skills/explain-code-precisely/SKILL.md"),
    "utf8",
  );
  if (!/^---\nname: explain-code-precisely\ndescription: .+\n---\n/s.test(skill)) {
    failures.push("explain-code-precisely skillのfrontmatterが不正");
  }
  if (!skill.includes("without losing technical precision")) {
    failures.push("skillにtechnical precisionの基準がない");
  }
} catch {
  // 欠落は前段で報告済み
}

try {
  const app = await readFile(resolve(root, "frontend/src/App.jsx"), "utf8");
  const trace = await readFile(resolve(root, "frontend/src/components/LearningTrace.jsx"), "utf8");
  const lab = await readFile(resolve(root, "docs/visual-lab/index.html"), "utf8");
  const combined = `${app}\n${trace}\n${lab}`;
  for (const forbidden of ["レストラン", "お客さん", "厨房", "食材庫"]) {
    if (combined.includes(forbidden)) failures.push(`主要教材に比喩表現が残っている: ${forbidden}`);
  }
  for (const required of ["POST /api/v1/tasks", "TasksController#create", "setTasks"]) {
    if (!combined.includes(required)) failures.push(`実行経路の識別子が不足: ${required}`);
  }
} catch {
  // 欠落は前段で報告済み
}

try {
  const quiz = JSON.parse(await readFile(resolve(root, "quiz/questions.json"), "utf8"));
  const lessonNumbers = quiz.lessons.map((lesson) => lesson.lesson);

  for (let lesson = 0; lesson <= 8; lesson += 1) {
    if (!lessonNumbers.includes(lesson)) failures.push(`quizにLesson ${lesson}がない`);
  }

  for (const lesson of quiz.lessons) {
    if (!Array.isArray(lesson.questions) || lesson.questions.length < 3) {
      failures.push(`Lesson ${lesson.lesson}の問題が3問未満`);
    }

    for (const [index, question] of lesson.questions.entries()) {
      if (!Array.isArray(question.choices) || question.choices.length < 2) {
        failures.push(`Lesson ${lesson.lesson} Q${index + 1}の選択肢が不足`);
      }
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.choices.length) {
        failures.push(`Lesson ${lesson.lesson} Q${index + 1}のanswerが不正`);
      }
      if (!question.explanation) failures.push(`Lesson ${lesson.lesson} Q${index + 1}に解説がない`);
    }
  }
} catch (error) {
  failures.push(`quiz JSONを読めない: ${error.message}`);
}

for (const relativePath of requiredFiles.filter((path) => path.endsWith(".svg"))) {
  try {
    const svg = await readFile(resolve(root, relativePath), "utf8");
    if (!svg.includes("<svg") || !svg.includes("</svg>")) {
      failures.push(`SVGの開始・終了tagが不正: ${relativePath}`);
    }
    if (!svg.includes("<title")) failures.push(`SVGにtitleがない: ${relativePath}`);
  } catch {
    // file欠落は前段で報告済み
  }
}

if (failures.length > 0) {
  console.error("\n教材構造チェック: 失敗\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("教材構造チェック: 成功（単一入口・Codex skill・Lesson 0〜8・quiz形式）");

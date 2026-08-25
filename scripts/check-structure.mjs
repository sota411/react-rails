#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "PROGRESS.md",
  "compose.yml",
  "frontend/src/App.jsx",
  "frontend/src/api/tasks.js",
  "frontend/src/components/TaskForm.jsx",
  "backend/config/routes.rb",
  "backend/app/controllers/api/v1/tasks_controller.rb",
  "backend/app/models/task.rb",
  "docs/visual-lab/index.html",
  "docs/visuals/00-course-map.svg",
  "docs/visuals/02-request-restaurant.svg",
  "exercises/01-javascript/tasks.mjs",
  "quiz/questions.json",
];

for (let lesson = 0; lesson <= 8; lesson += 1) {
  const names = [
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
  requiredFiles.push(`docs/lessons/${names[lesson]}`);
}

const failures = [];
for (const relativePath of requiredFiles) {
  try {
    await access(resolve(root, relativePath));
  } catch {
    failures.push(`見つからない: ${relativePath}`);
  }
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
      if (!question.explanation) {
        failures.push(`Lesson ${lesson.lesson} Q${index + 1}に解説がない`);
      }
    }
  }
} catch (error) {
  failures.push(`quiz JSONを読めない: ${error.message}`);
}

for (const relativePath of requiredFiles.filter((path) => path.endsWith(".svg"))) {
  try {
    const svg = await readFile(resolve(root, relativePath), "utf8");
    if (!svg.includes("<svg") || !svg.includes("</svg>")) {
      failures.push(`SVGの開始・終了タグが不正: ${relativePath}`);
    }
    if (!svg.includes("<title")) {
      failures.push(`SVGにtitleがない: ${relativePath}`);
    }
  } catch {
    // ファイル欠落は前段で報告済み
  }
}

if (failures.length > 0) {
  console.error("\n教材構造チェック: 失敗\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`教材構造チェック: 成功（必須${requiredFiles.length}ファイル・Lesson 0〜8・quiz形式）`);

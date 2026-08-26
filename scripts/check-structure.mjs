#!/usr/bin/env node

import { access, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");

const requiredFiles = [
  "README.md",
  "learn",
  "compose.yml",
  "frontend/src/App.jsx",
  "frontend/src/styles.css",
  "frontend/src/course/courseData.js",
  "frontend/src/course/checkers.js",
  "frontend/src/course/checkers.test.js",
  "backend/config/routes.rb",
  "backend/app/controllers/api/v1/tasks_controller.rb",
  "backend/app/models/task.rb",
];

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

  const learn = await readFile(resolve(root, "learn"), "utf8");
  if (/\bcodex\b/i.test(learn)) failures.push("learn がCodex CLIを参照している");
  if (!learn.includes("http://localhost:5173")) failures.push("learn が学習画面を開かない");
  if (!learn.includes("while :")) failures.push("learn が起動後すぐ終了する可能性がある");
} catch {
  // 欠落は前段で報告済み
}

try {
  const readme = await readFile(resolve(root, "README.md"), "utf8");
  if (!readme.includes("./learn")) failures.push("READMEに単一入口 ./learn がない");
  if (!readme.includes("Codex CLIは起動しません")) failures.push("READMEにbrowser-only方針が明記されていない");

  for (const forbidden of ["docker compose up", "npm run dev", "rails server"]) {
    if (readme.includes(forbidden)) failures.push(`READMEに別の起動経路がある: ${forbidden}`);
  }
} catch {
  // 欠落は前段で報告済み
}

try {
  const app = await readFile(resolve(root, "frontend/src/App.jsx"), "utf8");
  const data = await readFile(resolve(root, "frontend/src/course/courseData.js"), "utf8");
  const combined = `${app}\n${data}`;

  for (const required of [
    "今やること",
    "完了条件",
    "courseCatalog",
    "コードを確認",
    "GET /api/v1/tasks",
    "POST /api/v1/tasks",
  ]) {
    if (!combined.includes(required)) failures.push(`段階別UIに必要な文言またはidentifierが不足: ${required}`);
  }

  for (const forbidden of [
    "LearningTrace",
    "処理のX線モード",
    "レストラン",
    "お客さん",
    "厨房",
    "食材庫",
  ]) {
    if (combined.includes(forbidden)) failures.push(`新しい学習画面に旧設計が残っている: ${forbidden}`);
  }
} catch {
  // 欠落は前段で報告済み
}

try {
  const courseModule = await import(
    `${pathToFileURL(resolve(root, "frontend/src/course/courseData.js")).href}?check=${Date.now()}`
  );
  const courses = courseModule.courseCatalog;
  const validTypes = new Set(["read", "edit", "request", "quiz"]);

  if (!Array.isArray(courses) || courses.length < 6) {
    failures.push("ハンズオンが6本未満");
  } else {
    for (const course of courses) {
      if (!course.id || !course.title || !course.summary) {
        failures.push("courseにid・title・summaryが不足");
      }
      if (!Array.isArray(course.steps) || course.steps.length < 3) {
        failures.push(`${course.id}: Stepが3件未満`);
        continue;
      }

      for (const step of course.steps) {
        if (!step.id || !step.title || !step.goal || !step.completion) {
          failures.push(`${course.id}: Stepにid・title・goal・completionが不足`);
        }
        if (!validTypes.has(step.type)) {
          failures.push(`${course.id}/${step.id}: 不明なStep type ${step.type}`);
        }
        if (step.type === "edit" && (!step.checker || !step.starterCode || !step.targetFile)) {
          failures.push(`${course.id}/${step.id}: edit Stepの設定不足`);
        }
        if (step.type === "request" && (!step.request?.method || !step.request?.path || !step.request?.expectedStatus)) {
          failures.push(`${course.id}/${step.id}: request Stepの設定不足`);
        }
        if (step.type === "quiz" && (!Array.isArray(step.choices) || !Number.isInteger(step.answer))) {
          failures.push(`${course.id}/${step.id}: quiz Stepの設定不足`);
        }
      }
    }
  }
} catch (error) {
  failures.push(`courseData.jsを検証できない: ${error.message}`);
}

if (failures.length > 0) {
  console.error("\n教材構造チェック: 失敗\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("教材構造チェック: 成功（単一入口・Codexなし・6本以上・段階別Step・即時判定）");

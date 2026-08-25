#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const progressPath = fileURLToPath(new URL("../PROGRESS.md", import.meta.url));
const scorePath = fileURLToPath(new URL("../quiz/.last-score.json", import.meta.url));
const text = await readFile(progressPath, "utf8");

const lessonLines = [...text.matchAll(/^- \[([ xX])\] Lesson (\d+): (.+)$/gm)];
const completed = lessonLines.filter((match) => match[1].toLowerCase() === "x").length;
const total = lessonLines.length;
const selectedLesson = text.match(/selected_lesson:\s*(\d+|none)/)?.[1] ?? "none";
const barWidth = 18;
const filled = total === 0 ? 0 : Math.round((completed / total) * barWidth);
const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);

console.log("\nReact × Rails 学習進捗");
console.log("------------------------------");
console.log(`[${bar}] ${completed}/${total} Lesson`);
console.log(`選択中: ${selectedLesson === "none" ? "未選択" : `Lesson ${selectedLesson}`}`);

if (existsSync(scorePath)) {
  const score = JSON.parse(await readFile(scorePath, "utf8"));
  console.log(`直近のクイズ: Lesson ${score.lesson}・${score.percentage}%`);
}

console.log("\nLesson:");
for (const match of lessonLines) {
  const isDone = match[1].toLowerCase() === "x";
  const isSelected = String(match[2]) === String(selectedLesson);
  const marker = isSelected ? "→" : " ";
  const state = isDone ? "✓" : " ";
  console.log(`${marker} [${state}] Lesson ${match[2]}: ${match[3]}`);
}

console.log("\nLessonの選択と完了判定は学習者が行います。\n");

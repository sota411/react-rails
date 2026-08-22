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
const currentLesson = text.match(/current_lesson:\s*(\d+)/)?.[1] ?? "?";
const codexMode = text.match(/codex_mode:\s*([a-z]+)/)?.[1] ?? "?";
const barWidth = 18;
const filled = total === 0 ? 0 : Math.round((completed / total) * barWidth);
const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);

console.log("\nReact × Rails 学習進捗");
console.log("------------------------------");
console.log(`[${bar}] ${completed}/${total} Lesson`);
console.log(`現在のLesson: ${currentLesson}`);
console.log(`Codexモード: ${codexMode}`);

if (existsSync(scorePath)) {
  const score = JSON.parse(await readFile(scorePath, "utf8"));
  console.log(`直近のクイズ: Lesson ${score.lesson}・${score.percentage}% ${score.passed ? "✓" : "要復習"}`);
}

console.log("\n未完了:");
for (const match of lessonLines) {
  if (match[1].toLowerCase() !== "x") {
    const marker = String(match[2]) === String(currentLesson) ? "→" : " ";
    console.log(`${marker} Lesson ${match[2]}: ${match[3]}`);
  }
}

console.log("\nチェックを変えるのは学習者本人です。\n");

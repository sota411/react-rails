#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const quizPath = fileURLToPath(new URL("../quiz/questions.json", import.meta.url));
const scorePath = fileURLToPath(new URL("../quiz/.last-score.json", import.meta.url));
const quizData = JSON.parse(await readFile(quizPath, "utf8"));
const args = process.argv.slice(2);

function showList() {
  console.log("\nLessonごとの理解度クイズ\n");
  for (const lesson of quizData.lessons) {
    console.log(`  ${lesson.lesson}: ${lesson.title}（${lesson.questions.length}問）`);
  }
  console.log("\n実行例: node scripts/quiz.mjs 2\n");
}

if (args.includes("--list") || args.length === 0) {
  showList();
  process.exit(0);
}

const lessonNumber = Number(args[0]);
const lesson = quizData.lessons.find((item) => item.lesson === lessonNumber);

if (!lesson) {
  console.error(`Lesson ${args[0]} は見つかりません。`);
  showList();
  process.exit(1);
}

if (!input.isTTY) {
  console.error("このクイズは対話形式です。Terminalで直接実行してください。");
  process.exit(1);
}

const rl = createInterface({ input, output });
let correctCount = 0;
const answers = [];

console.log(`\n=== Lesson ${lesson.lesson}: ${lesson.title} ===`);
console.log("答えを選んでから解説が表示されます。\n");

for (let index = 0; index < lesson.questions.length; index += 1) {
  const question = lesson.questions[index];
  console.log(`Q${index + 1}. ${question.prompt}`);

  question.choices.forEach((choice, choiceIndex) => {
    console.log(`  ${choiceIndex + 1}. ${choice}`);
  });

  let selectedIndex = null;
  while (selectedIndex === null) {
    const rawAnswer = (await rl.question("回答 > ")).trim();
    const candidate = Number(rawAnswer) - 1;

    if (Number.isInteger(candidate) && candidate >= 0 && candidate < question.choices.length) {
      selectedIndex = candidate;
    } else {
      console.log(`1〜${question.choices.length}の数字で答えてください。`);
    }
  }

  const correct = selectedIndex === question.answer;
  if (correct) {
    correctCount += 1;
    console.log("✓ 正解");
  } else {
    console.log(`✗ 正解は ${question.answer + 1}. ${question.choices[question.answer]}`);
  }

  console.log(`  なぜ: ${question.explanation}\n`);
  answers.push({
    question: index + 1,
    selected: selectedIndex,
    correct: question.answer,
    passed: correct,
  });
}

await rl.close();

const total = lesson.questions.length;
const percentage = Math.round((correctCount / total) * 100);
const passed = percentage >= 80;

console.log("------------------------------");
console.log(`結果: ${correctCount}/${total}問・${percentage}%`);
console.log(passed ? "Lessonの理解確認ラインを通過しました。" : "間違えた問題の『なぜ』を自分の言葉で言い直しましょう。");
console.log("------------------------------\n");

await writeFile(
  scorePath,
  JSON.stringify(
    {
      lesson: lesson.lesson,
      title: lesson.title,
      correct: correctCount,
      total,
      percentage,
      passed,
      answeredAt: new Date().toISOString(),
      answers,
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

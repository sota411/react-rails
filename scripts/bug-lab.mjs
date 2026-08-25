#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const backupRoot = resolve(root, ".bug-lab");

const scenarios = {
  "404-path": {
    title: "一覧GETのpathが1文字違い、404になる",
    target: "frontend/src/api/tasks.js",
    before: 'const TASKS_PATH = "/api/v1/tasks";',
    after: 'const TASKS_PATH = "/api/v1/taskz";',
    symptom: "初回一覧とCRUDが404。NetworkのpathとRails routesを比べる。",
  },
  "422-empty-title": {
    title: "入力値を無視して空titleを送り、422になる",
    target: "frontend/src/api/tasks.js",
    before: 'body: JSON.stringify({ task: { title } }),',
    after: 'body: JSON.stringify({ task: { title: "" } }),',
    symptom: "何を入力しても追加が422。Payloadとresponse errorsを見る。",
  },
  "silent-toggle": {
    title: "doneをstrong parametersから外し、完了状態が保存されない",
    target: "backend/app/controllers/api/v1/tasks_controller.rb",
    before: "params.require(:task).permit(:title, :done)",
    after: "params.require(:task).permit(:title)",
    symptom: "PATCHは成功に見えるがdoneが変わらない。Payload・permit・responseを比べる。",
  },
  "shape-crash": {
    title: "一覧API clientが配列ではなくobjectを返し、画面が壊れる",
    target: "frontend/src/api/tasks.js",
    before: '  reportStage("receiving");\n  return readJson(response);\n}\n\nexport async function createTask',
    after: '  reportStage("receiving");\n  const tasks = await readJson(response);\n  return { tasks };\n}\n\nexport async function createTask',
    symptom: "GETは200だがtasks.map付近でConsole error。responseとstateの形を比べる。",
  },
};

function showList() {
  console.log("\n利用できる故障シナリオ\n");
  for (const [id, scenario] of Object.entries(scenarios)) {
    console.log(`${id}\n  ${scenario.title}\n  症状: ${scenario.symptom}\n`);
  }
  console.log("適用: node scripts/bug-lab.mjs 404-path --apply");
  console.log("復元: node scripts/bug-lab.mjs 404-path --revert\n");
}

async function showStatus() {
  if (!existsSync(backupRoot)) {
    console.log("適用中の故障はありません。");
    return;
  }

  const entries = await readdir(backupRoot, { withFileTypes: true });
  const active = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  if (active.length === 0) {
    console.log("適用中の故障はありません。");
    return;
  }

  console.log("適用中:");
  active.forEach((id) => console.log(`- ${id}`));
}

async function replaceExactlyOnce(content, before, after) {
  const first = content.indexOf(before);
  const last = content.lastIndexOf(before);

  if (first === -1) {
    throw new Error("置換対象が見つかりません。既に変更済みか、教材コードが変わっています。");
  }
  if (first !== last) {
    throw new Error("置換対象が複数あります。安全のため自動変更を中止しました。");
  }

  return content.slice(0, first) + after + content.slice(first + before.length);
}

async function applyScenario(id) {
  const scenario = scenarios[id];
  if (!scenario) throw new Error(`不明なscenario: ${id}`);

  const scenarioBackup = resolve(backupRoot, id);
  if (existsSync(scenarioBackup)) {
    throw new Error(`${id} は既に適用中です。先に--revertしてください。`);
  }

  const targetPath = resolve(root, scenario.target);
  const original = await readFile(targetPath, "utf8");
  const changed = await replaceExactlyOnce(original, scenario.before, scenario.after);

  await mkdir(scenarioBackup, { recursive: true });
  await writeFile(resolve(scenarioBackup, "original.txt"), original, "utf8");
  await writeFile(
    resolve(scenarioBackup, "meta.json"),
    JSON.stringify({ id, target: scenario.target, appliedAt: new Date().toISOString() }, null, 2) + "\n",
    "utf8",
  );
  await writeFile(targetPath, changed, "utf8");

  console.log(`\n故障 ${id} を適用しました。`);
  console.log(`症状: ${scenario.symptom}`);
  console.log("原因を探す前に、画面 → Console → Network → Railsログの順に証拠を記録してください。");
  console.log(`復元: node scripts/bug-lab.mjs ${id} --revert\n`);
}

async function revertScenario(id) {
  const scenario = scenarios[id];
  if (!scenario) throw new Error(`不明なscenario: ${id}`);

  const scenarioBackup = resolve(backupRoot, id);
  if (!existsSync(scenarioBackup)) {
    throw new Error(`${id} は適用されていません。`);
  }

  const original = await readFile(resolve(scenarioBackup, "original.txt"), "utf8");
  await writeFile(resolve(root, scenario.target), original, "utf8");
  await rm(scenarioBackup, { recursive: true, force: true });

  console.log(`${id} を元へ戻しました。git diffで状態を確認してください。`);
}

const args = process.argv.slice(2);

try {
  if (args.includes("--list") || args.length === 0) {
    showList();
  } else if (args.includes("--status")) {
    await showStatus();
  } else {
    const id = args[0];
    if (args.includes("--apply")) {
      await applyScenario(id);
    } else if (args.includes("--revert")) {
      await revertScenario(id);
    } else {
      throw new Error("--apply または --revert を指定してください。");
    }
  }
} catch (error) {
  console.error(`bug-lab: ${error.message}`);
  process.exit(1);
}

import test from "node:test";
import assert from "node:assert/strict";
import { activeTasks, addTask, taskTitles } from "./tasks.mjs";

const sampleTasks = [
  { id: 1, title: "Reactを開く", done: true },
  { id: 2, title: "Networkを見る", done: false },
  { id: 3, title: "Railsログを見る", done: false },
];

test("TODO 1: titleだけの配列を返す", () => {
  assert.deepEqual(taskTitles(sampleTasks), [
    "Reactを開く",
    "Networkを見る",
    "Railsログを見る",
  ]);
});

test("TODO 2: 未完了のtaskだけを返す", () => {
  assert.deepEqual(activeTasks(sampleTasks), [sampleTasks[1], sampleTasks[2]]);
});

test("TODO 3: 新しいtaskを先頭へ追加する", () => {
  const result = addTask(sampleTasks, "propsを説明する");

  assert.equal(result.length, 4);
  assert.deepEqual(result[0], {
    id: 4,
    title: "propsを説明する",
    done: false,
  });
});

test("TODO 3: 元の配列を直接変更しない", () => {
  const before = structuredClone(sampleTasks);

  addTask(sampleTasks, "stateを説明する");

  assert.deepEqual(sampleTasks, before);
});

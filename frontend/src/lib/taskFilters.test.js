import test from "node:test";
import assert from "node:assert/strict";
import { countTasks, filterTasks } from "./taskFilters.js";

const tasks = [
  { id: 1, title: "Reactを触る", done: false },
  { id: 2, title: "Railsを触る", done: true },
];

test("activeを指定すると未完了だけを返す", () => {
  assert.deepEqual(filterTasks(tasks, "active"), [tasks[0]]);
});

test("doneを指定すると完了だけを返す", () => {
  assert.deepEqual(filterTasks(tasks, "done"), [tasks[1]]);
});

test("件数を全体・未完了・完了に分ける", () => {
  assert.deepEqual(countTasks(tasks), { all: 2, active: 1, done: 1 });
});

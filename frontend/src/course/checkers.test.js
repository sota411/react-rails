import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCode } from "./checkers.js";

test("react-props passes when props are received and rendered", () => {
  const result = evaluateCode(
    "react-props",
    `export default function TaskCount({ done, total }) {
      return <p>完了: {done} / {total}</p>;
    }`,
  );

  assert.equal(result.passed, true);
});

test("react-props does not count TODO comments as implementation", () => {
  const result = evaluateCode(
    "react-props",
    `// function TaskCount({ done, total }) { return <p>{done}{total}</p> }
    export default function TaskCount() {
      return <p>完了: 0 / 0</p>;
    }`,
  );

  assert.equal(result.passed, false);
});

test("react-state accepts functional state updater", () => {
  const result = evaluateCode(
    "react-state",
    `import { useState } from "react";
    export default function HintButton() {
      const [open, setOpen] = useState(false);
      function handleClick() {
        setOpen(current => !current);
      }
      return <button onClick={handleClick}>{String(open)}</button>;
    }`,
  );

  assert.equal(result.passed, true);
});

test("rails route requires both path and controller action", () => {
  const incomplete = evaluateCode("rails-route", `get "stats"`);
  const complete = evaluateCode("rails-route", `get "stats", to: "stats#show"`);

  assert.equal(incomplete.passed, false);
  assert.equal(complete.passed, true);
});

test("rails controller checks Task.count JSON response", () => {
  const result = evaluateCode(
    "rails-controller",
    `class StatsController < ApplicationController
      def show
        render json: { count: Task.count }
      end
    end`,
  );

  assert.equal(result.passed, true);
});

test("validation requires title presence", () => {
  assert.equal(
    evaluateCode("rails-validation", `validates :title, presence: true`).passed,
    true,
  );
  assert.equal(
    evaluateCode("rails-validation", `validates :title, length: { maximum: 100 }`).passed,
    false,
  );
});

test("fullstack fetch requires exact Rails payload shape", () => {
  const result = evaluateCode(
    "fullstack-fetch",
    `export async function createTask(title) {
      return fetch("/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: { title } }),
      });
    }`,
  );

  assert.equal(result.passed, true);
});

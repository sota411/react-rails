---
name: explain-code-precisely
description: Explain React, Rails, JavaScript, Ruby, HTTP, databases, tests, errors, and repository code to a beginner as simply as possible without losing technical precision. Use when the learner asks what code means, why behavior occurs, how data moves, what a technical term means, where an error originates, or requests a diagram or quiz. Preserve exact technical terms and repository identifiers; do not use analogies unless explicitly requested.
---

# Explain Code Precisely

## Explanation sequence

1. Inspect the actual code, test, Network record, or log before explaining it.
2. Start with a one-sentence conclusion.
3. Show the causal path in execution order using exact file paths and identifiers.
4. Define only the technical terms newly needed for that explanation.
5. Show at most one code fragment, limited to the lines that cause the behavior.
6. End with one prediction or observation question that checks understanding.

Use this shape when it fits:

```text
結論

実行順
1. trigger
2. function / method
3. data change
4. return value or HTTP response
5. visible result

新しい用語

確認問題
```

## Precision rules

- Keep exact names such as `state`, `props`, `render`, `HTTP request`, `Route`, `Controller`, `Model`, `migration`, `validation`, `JSON`, and `status code`.
- At first use, add a one-sentence Japanese definition in parentheses.
- Distinguish syntax from runtime behavior. State what the code is written as, then what happens when it executes.
- Distinguish confirmed facts from inference. Use「このコードから確認できる」and「ログがないため推測」explicitly.
- Do not say a value「just changes」. Name the setter, method, SQL operation, or response that changes it.
- Do not say「Rails receives it」without naming the HTTP method, path, matched Route, and Controller action.
- Do not say「the screen updates」without naming the state update and resulting re-render.
- Do not claim a diagram is runtime instrumentation when it is only a teaching visualization.

Read [references/terms.md](references/terms.md) when an exact beginner-level definition is needed.

## Simplicity rules

- Use one idea per paragraph and no more than three sentences per paragraph.
- Prefer a concrete repository example over a general explanation.
- Keep code samples to roughly 12 lines or fewer.
- Explain punctuation only when it affects the current task.
- Do not introduce adjacent concepts merely because they are related.
- Do not replace technical concepts with restaurants, workers, warehouses, magic, or other stories unless the learner asks for an analogy.

## Visual rules

Create or use a visual only when it adds information that prose does not show clearly.

Good visuals show at least one of these:

- time order: which function or request happens first
- state change: exact value before and after
- data movement: method, path, payload, response, and destination
- correspondence: code line to Network entry to Rails log to SQL
- structure: parent Component, child Component, and props direction

Do not turn sentences into labeled boxes. A visual must let the learner compare, trace, or predict something.

## Understanding check

Ask one question that requires a prediction or an observation, not memorization.

Good:

> `setTasks` を削除してPOSTだけ成功した場合、DBと画面はそれぞれどうなりますか？

Avoid:

> stateとは何ですか？

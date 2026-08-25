# Lesson 1 — JavaScriptの最低限

## 今日の完成物

`exercises/01-javascript/tasks.mjs` の3つのTODOを埋め、テストを通します。

```bash
node --test exercises/01-javascript/tasks.test.mjs
```

Reactを学ぶ前に必要なのは、JavaScript全体ではなく次の4つです。

1. 値を名前で覚える `const`
2. 複数の値を並べる配列 `[]`
3. 名前と値をまとめるobject `{}`
4. 処理をまとめるfunction

## 0. 実行前に予想

```js
const task = { title: "Networkを見る", done: false };
console.log(task.title);
```

何が表示されるでしょう。実行前に答えてください。

```bash
node -e 'const task={title:"Networkを見る",done:false}; console.log(task.title)'
```

## 1. 1件のtaskはobject

```js
const task = {
  id: 1,
  title: "Networkを見る",
  done: false,
};
```

| 部分 | 呼び方 | 意味 |
|---|---|---|
| `task` | 変数名 | このまとまりへ付けた名前 |
| `title` | key | 項目名 |
| `"Networkを見る"` | value | 項目に入っている値 |
| `false` | boolean | はい・いいえの2択を表す値 |

値を読む:

```js
task.title  // "Networkを見る"
task.done   // false
```

## 2. 複数のtaskは配列

```js
const tasks = [
  { id: 1, title: "Reactを開く", done: true },
  { id: 2, title: "Networkを見る", done: false },
];
```

配列は「同じ種類のカードを順番に入れた箱」と考えます。

```text
index 0 → Reactを開く
index 1 → Networkを見る
```

## 3. mapは「全員を別の姿にする」

```js
const titles = tasks.map((task) => task.title);
```

処理を分解します。

```text
受け取る: task objectを1件ずつ
行う:     titleだけ取り出す
返す:     titleの配列
```

結果:

```js
["Reactを開く", "Networkを見る"]
```

Reactでは、task objectを `<TaskItem />` という画面部品へ変えるときに `map` を使います。

## 4. filterは「条件に合う人だけ残す」

```js
const activeTasks = tasks.filter((task) => task.done === false);
```

結果:

```js
[{ id: 2, title: "Networkを見る", done: false }]
```

`map` は数を基本的に変えず形を変えます。`filter` は形を変えず、残す数を変えます。

| 元の配列 | 操作 | 結果 |
|---|---|---|
| task 2件 | `map` | title 2件 |
| task 2件 | `filter` | 未完了task 1件 |

## 5. functionは処理へ名前を付ける

```js
function addTask(tasks, title) {
  const newTask = {
    id: tasks.length + 1,
    title: title,
    done: false,
  };

  return [newTask, ...tasks];
}
```

### 1行ずつ

| 行 | 受け取る | 行う | 次へ渡す |
|---|---|---|---|
| `function addTask(tasks, title)` | 配列と文字 | 処理を開始 | function内部 |
| `const newTask = ...` | title | 新taskを作る | newTask |
| `return [newTask, ...tasks]` | 新旧task | 新しい配列を作る | 呼び出し元 |

`...tasks` は、配列の中身をここへ広げる記号です。

## 6. 手を動かす

ファイルを開きます。

```text
exercises/01-javascript/tasks.mjs
```

### TODO 1: titleだけの配列

```js
export function taskTitles(tasks) {
  // TODO: mapを使う
}
```

### TODO 2: 未完了だけ残す

```js
export function activeTasks(tasks) {
  // TODO: filterを使う
}
```

### TODO 3: 新taskを先頭へ追加

```js
export function addTask(tasks, title) {
  // TODO: 元のtasksを直接変更しない
}
```

1つ直すたびに実行します。

```bash
node --test exercises/01-javascript/tasks.test.mjs
```

赤い結果が出たら、次だけ読みます。

```text
expected: 期待していた値
actual:   実際に返った値
```

## よくある間違い

### `forEach`でreturnしたつもりになる

`forEach` 自体は新しい配列を返しません。別の形の配列が欲しいなら `map` を検討します。

### `tasks.push(newTask)` を使う

元の配列を直接変えます。Reactのstateでは、変化を追いやすくするため新しい配列を作ります。

```js
return [newTask, ...tasks];
```

### `=` と `===`

```js
task.done = false   // 値を入れる
task.done === false // 同じか比べる
```

## 理解度クイズ

```bash
node scripts/quiz.mjs 1
```

## Codexへ送る

```text
Lesson 1のTODO 2で詰まりました。
完成コードは出さず、mapとfilterのどちらを使うか判断する質問を1つください。
私の予想は「（ここへ書く）」です。
```

## 完了条件

- [ ] 3テストが成功
- [ ] objectと配列の違いを説明できる
- [ ] mapとfilterの違いを具体例で説明できる
- [ ] 元の配列を直接変えない理由を一文で言える

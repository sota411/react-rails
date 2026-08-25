# Lesson 2 — Reactの部品とprops

## 今日の完成物

`App.jsx` に直接書かれている件数表示を、`TaskCounter` という部品へ切り出します。

見た目は変えません。**同じ見た目を、小さな部品の組み合わせへ整理する**練習です。

## 0. 先に画面を見る

Task Bridge右上の表示:

```text
1 / 3 完了
```

この小さな領域だけを、1つのComponent（画面の部品）にします。

## 1. Componentは関数

最小のComponent:

```jsx
function Greeting() {
  return <p>こんにちは</p>;
}
```

普通のJavaScript functionと同じく、入力を受け取り、結果を返します。ただし結果はJSX（画面の設計図）です。

```text
受け取る: props
行う:     表示内容を計算
返す:     JSX
```

## 2. propsは親から渡される値

```jsx
<TaskItem task={task} disabled={false} />
```

この呼び出しは、次の袋を渡すイメージです。

```js
{
  task: task,
  disabled: false,
}
```

受け取る側:

```jsx
function TaskItem({ task, disabled }) {
  // taskとdisabledを使える
}
```

`props` は子Componentが勝手に書き換えるものではありません。必要な変更は親へ知らせます。

## 3. 実際のコードを追う

`frontend/src/components/TaskList.jsx`:

```jsx
<ul className="task-list">
  {tasks.map((task) => (
    <TaskItem
      key={task.id}
      task={task}
      onToggle={onToggle}
      onDelete={onDelete}
      disabled={disabled}
    />
  ))}
</ul>
```

### データの変化

```text
task object
  ↓ map
<TaskItem task={task} ... />
  ↓ TaskItemがJSXを返す
<li> ... </li>
```

### `key` は何か

Reactが「この画面部品は、前回のどのtaskと同じか」を見分ける名札です。配列の順番ではなく、DBが付けた `task.id` を使います。

## 4. 手を動かす: TaskCounterを作る

### Step 1 — 新しいファイル

作成:

```text
frontend/src/components/TaskCounter.jsx
```

まず日本語の擬似コードを書きます。

```jsx
// doneとallをpropsで受け取る
// counterクラスのdivを返す
// doneをstrong、allをspanへ表示する
```

### Step 2 — Appへimport

`frontend/src/App.jsx` の上部へ追加します。

```jsx
import TaskCounter from "./components/TaskCounter.jsx";
```

`import` は、別ファイルから値やComponentを持ってくる記述です。

### Step 3 — 既存表示を置き換える

探す場所:

```jsx
<div className="counter" aria-label="タスクの件数">
  ...
</div>
```

目標の呼び出し方:

```jsx
<TaskCounter done={counts.done} all={counts.all} />
```

完成コードを最初から見ず、まず `TaskItem` のprops受け取り方を真似してください。

## 5. 観察する

```bash
cd frontend
npm run dev
```

確認:

- 見た目が変わっていない
- Consoleに赤いエラーがない
- taskを完了すると件数が変わる

見た目が同じでも、コード構造は変わっています。

## 6. 自分で壊して理解する

一時的に次のどちらかを試し、エラーを読んでから戻します。

### importを消す

予想: `TaskCounter is not defined` に近いエラー。

### prop名を変える

親:

```jsx
<TaskCounter completed={counts.done} all={counts.all} />
```

子が `done` を受け取ったままだと、`done` は `undefined` になります。

## 7. 読み方の順番

Componentで迷ったら、次の順で追います。

1. どこで `<Component ... />` と呼ばれたか
2. どのpropsを渡しているか
3. Componentの引数で何を受け取ったか
4. returnのどこへ表示しているか

## 理解度クイズ

```bash
node scripts/quiz.mjs 2
```

## Codexへ送る

```text
Lesson 2のTaskCounterを作ります。codex_modeはcoachです。
まだコードを変更せず、TaskItemを参考に、
TaskCounterが受け取るpropsを私に質問してください。
```

## 完了条件

- [ ] TaskCounterへ切り出した
- [ ] 画面の件数が正しく変わる
- [ ] propsを「親から渡される値」と説明できる
- [ ] `key={task.id}` の役割を一文で言える

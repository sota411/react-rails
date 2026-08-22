# Lesson 2演習 — TaskCounterを切り出す

## 完成画面

見た目は変わりません。

```text
1 / 3 完了
```

変えるのはコードの置き場所です。

## 変更前

`frontend/src/App.jsx` の中に件数表示があります。

```jsx
<div className="counter" aria-label="タスクの件数">
  <strong>{counts.done}</strong>
  <span>/ {counts.all} 完了</span>
</div>
```

## 作業

### 1. 擬似コードを書く

新しいファイルへ、まず日本語コメントだけ書きます。

```text
frontend/src/components/TaskCounter.jsx
```

```jsx
// doneとallを受け取る
// counterクラスのdivを返す
// doneをstrongへ表示する
// allをspanへ表示する
```

### 2. 参考にするファイル

```text
frontend/src/components/TaskItem.jsx
```

次だけ探します。

- Componentの引数でpropsを受け取る書き方
- `export default function` の形
- JSXをreturnする形

### 3. Appから呼ぶ

目標:

```jsx
<TaskCounter done={counts.done} all={counts.all} />
```

## 自己確認

- [ ] 見た目が変わっていない
- [ ] taskを完了すると数字が変わる
- [ ] Consoleに赤いエラーがない
- [ ] 親が渡す名前と子が受け取る名前が一致

## 説明問題

```text
TaskCounterは何を受け取り、何をし、何を返しますか？
```

解答例は `solutions/02-react-components/TaskCounter.jsx` にあります。先に比較せず、自分の画面が動いてから開いてください。

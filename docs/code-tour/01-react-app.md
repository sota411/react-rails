# Code Tour 1 — Reactの入口から画面まで

対象:

```text
frontend/src/main.jsx
frontend/src/App.jsx
```

## まず全体

```text
index.htmlのroot
  ↓ main.jsx
<App />を表示
  ↓ App.jsx
stateを用意
  ↓
一覧を取得
  ↓
各Componentへ値とfunctionをpropsで渡す
```

## main.jsxを1行ずつ

```jsx
① import ReactDOM from "react-dom/client";
② import App from "./App.jsx";
③ import "./styles.css";

④ const rootElement = document.getElementById("root");
⑤ const root = ReactDOM.createRoot(rootElement);

⑥ root.render(<App />);
```

### ① ReactDOMを読み込む

```text
受け取る: react-dom packageの機能
行う: ブラウザのDOMへReactを接続できるようにする
次へ: createRootで使う
```

> **DOM**は、ブラウザがHTMLを木構造として扱う仕組みです。今は「実際の画面を置く場所」で十分です。

### ② Appを読み込む

`./App.jsx` の `.` は「このファイルと同じsrcディレクトリから」という意味です。

```text
受け取る: App Component
行う: main.jsx内で使える名前にする
次へ: ⑥の<App />
```

### ③ CSSを読み込む

値を変数へ入れていませんが、CSSファイルを読み込むという効果があります。

### ④ root要素を探す

`frontend/index.html`:

```html
<div id="root"></div>
```

`document.getElementById("root")` は、この箱を探します。

### ⑤ React用の入口にする

普通のDOM要素を、Reactが画面を管理するrootへ変えます。

### ⑥ Appを表示する

```jsx
root.render(<App />);
```

`App()` と直接書かず、Componentとして `<App />` と書きます。

## Appのstate

```jsx
① const [tasks, setTasks] = useState([]);
② const [filter, setFilter] = useState("all");
③ const [status, setStatus] = useState("loading");
④ const [errorMessage, setErrorMessage] = useState("");
```

| state | 最初の値 | 何を覚えるか |
|---|---|---|
| `tasks` | `[]` | Railsから来たtask一覧 |
| `filter` | `"all"` | すべて・未完了・完了の選択 |
| `status` | `"loading"` | 読込中・保存中・準備完了・失敗 |
| `errorMessage` | `""` | 画面へ出す失敗理由 |

`setTasks` などは、それぞれのstateを変える専用functionです。

## 最初の一覧取得

```jsx
① useEffect(() => {
②   loadTasks();
③ }, []);
```

### ① useEffect

画面を表示した後に、外部と同期する処理を行います。この場合の外部はRails APIです。

### ② loadTasks

別に定義したasync functionを呼びます。

### ③ 空の配列

このEffectがどの値の変化に反応するかを示します。空配列なので、このComponentを画面へ置いた最初のタイミングで実行する意図です。

## loadTasksのhappy path

```jsx
① setStatus("loading");
② setErrorMessage("");

③ const loadedTasks = await getTasks(...);
④ setTasks(loadedTasks);
⑤ setStatus("ready");
```

```text
① 画面を読込中にする
② 前回のエラーを消す
③ Railsの返事を待つ
④ task配列をstateへ保存
⑤ 読込完了にする
```

### `await` は何を待つ？

`getTasks` が返すPromise（将来返ってくる値）を待ちます。ブラウザ全体を止めるのではなく、このasync functionの続きが待ちます。

## 失敗側

```jsx
try {
  // 通信と成功処理
} catch (error) {
  setErrorMessage(error.message);
  setStatus("error");
}
```

`try` 内でthrowされたErrorを `catch` が受け取ります。

```text
受け取る: Error object
行う: messageをstateへ保存
次へ: JSXのerror-cardへ表示
```

## handleAdd

```jsx
① async function handleAdd(title) {
②   setStatus("saving");
③   const newTask = await createTask(title, ...);
④   setTasks((currentTasks) => [newTask, ...currentTasks]);
⑤   setStatus("ready");
⑥   return true;
⑦ }
```

### ① titleを受け取る

TaskFormがpropsの `onAdd` を呼び、入力文字を渡します。

### ② 保存中

buttonを一時的にdisabledへし、連打を防ぐ表示に使います。

### ③ Railsへ作成依頼

`createTask` は成功すると、DBへ保存されたtask objectを返します。idも含まれます。

### ④ stateの先頭へ追加

```text
newTask              新しく返った1件
...currentTasks      今までの全件
[ ... ]              新しい配列
```

元の配列へpushせず、新しい配列をsetterへ渡します。

### ⑥ trueを返す

TaskForm側は成功時だけ入力欄を空にします。

```jsx
const added = await onAdd(trimmedTitle);
if (added) setTitle("");
```

AppとTaskFormが「成功したか」というbooleanで相談しています。

## JSXでpropsを渡す

```jsx
<TaskForm onAdd={handleAdd} disabled={isBusy} />
```

```text
AppのhandleAdd ──props名onAdd──> TaskForm
AppのisBusy    ──props名disabled──> TaskForm
```

子ComponentはAppのstateを直接触らず、渡された値とfunctionだけを使います。

## 読解確認

1. 最初のtask一覧は、どのfunctionが取りに行きますか？
2. Railsから返った新taskは、どのsetterへ渡されますか？
3. TaskFormが入力欄を空にするか判断するため、handleAddは何を返しますか？
4. statusがsavingの間、画面の何が変わりますか？

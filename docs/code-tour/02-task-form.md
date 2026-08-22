# Code Tour 2 — 入力フォームを1行ずつ読む

対象:

```text
frontend/src/components/TaskForm.jsx
```

## このComponentの仕事

```text
受け取る: onAdd function、disabled boolean
覚える:   入力中のtitle
行う:     submit時に空白を除き、onAddへ渡す
返す:     formのJSX
```

DB保存はTaskFormの仕事ではありません。TaskFormは親へ「このtitleを追加して」と頼みます。

## functionの入口

```jsx
① export default function TaskForm({ onAdd, disabled }) {
```

### `export default`

別ファイルから、名前を指定せず代表値としてimportできるようにします。

```jsx
import TaskForm from "./components/TaskForm.jsx";
```

### `{ onAdd, disabled }`

props objectから2項目を取り出しています。

長く書くなら:

```jsx
function TaskForm(props) {
  const onAdd = props.onAdd;
  const disabled = props.disabled;
}
```

## title state

```jsx
② const [title, setTitle] = useState("");
```

最初は空文字です。

```text
入力前: title = ""
Rを入力: title = "R"
eを入力: title = "Re"
...
```

## submit function

```jsx
③ async function handleSubmit(event) {
④   event.preventDefault();

⑤   const trimmedTitle = title.trim();
⑥   if (trimmedTitle === "") {
⑦     return;
⑧   }

⑨   const added = await onAdd(trimmedTitle);
⑩   if (added) {
⑪     setTitle("");
⑫   }
⑬ }
```

### ③ eventを受け取る

formでsubmitが発生すると、Reactがevent objectを渡します。

### ④ ページ再読み込みを止める

HTML formは本来、別ページへ送信して再読み込みする動きを持ちます。このアプリではJavaScriptでHTTP通信するため、標準動作を止めます。

### ⑤ 前後の空白を除く

```js
"  Networkを見る  ".trim()
// "Networkを見る"
```

元のtitleを直接変えず、別名 `trimmedTitle` へ入れます。

### ⑥〜⑧ 空なら終了

`return` に値がないため、このfunctionの残りを実行せず終了します。Railsへ通信しません。

### ⑨ 親のfunctionを呼ぶ

`onAdd` の実体はAppの `handleAdd` です。

```text
TaskFormでは onAdd という役割名
Appでは      handleAdd という実装名
```

### ⑩〜⑫ 成功時だけ空にする

失敗時に入力文字を残すためです。422や通信失敗後、ユーザーが入力をやり直せます。

## JSXのform

```jsx
⑭ <form className="task-form" onSubmit={handleSubmit}>
```

`onSubmit` へfunctionを渡しています。

間違い:

```jsx
onSubmit={handleSubmit()}
```

これは画面を描く途中でfunctionを実行した結果を渡します。

正しい形:

```jsx
onSubmit={handleSubmit}
```

submitが起きた時にReactが呼びます。

## 入力欄

```jsx
<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  disabled={disabled}
/>
```

### `value={title}`

画面に表示する文字をstateへ合わせます。

### `onChange`

```text
キー入力
  ↓ event.target.value
現在の入力文字
  ↓ setTitle
state更新
  ↓ value={title}
入力欄へ反映
```

このようにReactのstateが入力欄の値を管理する形を、controlled input（Reactが値を管理する入力）と呼びます。

## 追加button

```jsx
<button
  type="submit"
  disabled={disabled || title.trim() === ""}
>
```

disabledになる条件:

```text
親が処理中
  OR
入力が空
```

`||` は「どちらかがtrueならtrue」です。

## propsの境界

TaskFormが知っていること:

- title
- submitされたこと
- onAddの成功・失敗

TaskFormが知らないこと:

- RailsのURL
- Controller名
- DB table
- tasks一覧全体

責任を小さくすると、コードを読む範囲も小さくなります。

## 読解確認

1. titleの前後に空白がある場合、Railsへ何が渡りますか？
2. 空文字ならonAddは呼ばれますか？
3. onAddがfalseを返した場合、入力欄は空になりますか？
4. `disabled || title.trim() === ""` の左右はそれぞれ何ですか？

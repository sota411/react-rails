# Lesson 3演習 — 説明文を開閉する

対象:

```text
frontend/src/components/TaskForm.jsx
```

## 受け入れ条件

- [ ] 最初は説明文が見える
- [ ] ボタンで隠せる
- [ ] もう一度押すと戻る
- [ ] ボタン文字が「説明を隠す / 説明を表示」で変わる
- [ ] 入力中のtitleは消えない
- [ ] 追加submitは勝手に動かない

## 実装前の予想

```text
新しく必要なstateの名前:
最初の値:
クリック後の値:
JSXで表示を決める条件:
```

## 作業の順番

1. `showHint` stateを追加
2. `type="button"` のbuttonを追加
3. clickで現在値の反対へ変える
4. trueのときだけ説明文を表示
5. button文字を2択で変える

1つごとにブラウザで確認してください。

## わざと壊す

一度だけbuttonの `type="button"` を外し、入力後に押します。

観察:

- submitが呼ばれたか
- NetworkへPOSTが出たか
- なぜform内buttonではtypeが重要か

確認後、必ず元へ戻します。

## 説明問題

```text
showHintとtitleは、どちらもstateなのに、片方を変えても片方が消えないのはなぜですか？
```

# Codex学習ハーネス

## 目的

Codexを禁止するのではなく、**学習者が考える前に完成コードが出ること**を防ぎます。

このリポジトリでは、次の4つを組み合わせます。

1. `AGENTS.md`: Codexの教え方を固定する
2. `PROGRESS.md`: 現在のLessonと権限を記録する
3. Lessonごとの完了条件: 説明・クイズ・テストを要求する
4. `solutions/`: 解答例を通常の作業場所から離す

## 権限を段階的に変える

### 1. coach

最初はコード変更を許可しません。

```yaml
codex_mode: coach
```

Codexへ依頼すること:

- 用語を日本語で説明する
- 実行結果の予想問題を出す
- 見るべきファイルを示す
- ヒントを1段階ずつ出す

### 2. pair

学習者が日本語の擬似コードを書いた後、1つのTODOだけ共同編集します。

```yaml
codex_mode: pair
```

良い依頼:

```text
私の予想は「filterがactiveならdone=falseだけ残る」です。
この説明が合っているか確認し、exercises/01-javascript/tasks.mjs のTODO 2だけ一緒に直してください。
```

悪い依頼:

```text
全部完成させて。
```

### 3. reviewer

自分で書いた後、Codexは修正せずレビューだけします。

```yaml
codex_mode: reviewer
```

```text
git diffを見てください。コードは変更せず、
1. 意図どおりの部分
2. バグになる部分
3. 私への理解確認質問
に分けてください。
```

### 4. implementer

Lesson 7の最終課題だけで使います。先に設計メモが必要です。

```yaml
codex_mode: implementer
```

Codexは「DBだけ」「Controllerだけ」のように小分けにし、各段階でテストします。

## Codexが先回りしたとき

次を送ります。

```text
今の回答は完成形を先に出しています。
AGENTS.md の coach モードへ戻り、答えを隠してください。
見る場所と確認質問を1つだけ出してください。
```

## 学習ログを残す

Lesson終了時、`PROGRESS.md` へ自分で次を書きます。

```text
入力:
処理:
出力:
詰まった場所:
次回なら最初に見る場所:
```

コードより、この説明が学習成果です。

# Codex向け学習ルール

学習者はReact、Rails、JavaScript、Rubyを初めて使います。
Codexは答えを簡単にする一方で、技術的な因果関係や正式な用語を失わないでください。

## セッション開始

1. `START_HERE.md` と `PROGRESS.md` を読む
2. `.agents/skills/explain-code-precisely/SKILL.md` を使用する
3. 最初はLesson 0〜8の一覧だけを表示する
4. 学習者が番号を選ぶまでLessonを決めない

前提Lessonは「推奨」として説明できますが、受講を強制しません。
学習者が選んだLessonだけを開きます。

## 1回に進める量

Lesson選択後は、次を一度に1周だけ行います。

1. 実行前の予想を1問出す
2. 操作または編集箇所を1つだけ示す
3. 実行する
4. 画面、Console、Network、Railsログ、testのうち必要な証拠を1つ確認する
5. 実際の結果を、function名とdataの変化を含めて説明する
6. 確認問題を1問出す

複数のTODOやLessonを自動で進めません。
次へ進む、説明を求める、クイズを行う、終了する、の選択は学習者に委ねます。

## コード変更

- 学習者が自分で書く段階では、編集対象と期待結果だけを示す
- 学習者が明示的に実装を依頼した場合は、合意した1か所だけ変更する
- 変更後はdiffと確認結果を説明する
- 複数層へまたがる機能は、DB、Rails、HTTP、React、testへ分けて確認する
- `solutions/` は学習者が解答を求めるまで読まない

## 説明

- 比喩は、学習者が明示的に求めた場合だけ使う
- 正式な用語を残し、初出時に短い日本語の定義を添える
- 実際のfile path、function、method、URL、status、payloadを示す
- 「受け取る」「変更する」「返す」の対象を具体的に書く
- 1段落は3文以内にする
- 周辺知識を一度に追加しない

曖昧な説明を避けます。

```text
避ける: stateは画面が覚える値
使う: stateはReactがComponentごとに保持する値。setterで更新すると再レンダーが予定される

避ける: RailsがDBに保存する
使う: POST /api/v1/tasks が TasksController#create に対応し、Task#save がtasks tableへINSERTする
```

## デバッグ

修正前に、どこまで正常かを証拠で決めます。

1. 画面の操作と結果
2. ConsoleのJavaScript error
3. Networkのmethod、path、status、request、response
4. RailsログのRoute、Controller、SQL
5. DBに保存された値

確認できた事実と推測を分けて説明します。

## 進捗

- Lessonの選択後、学習者の了承を得て `selected_lesson` を更新する
- Lesson完了は、学習者が完了と判断した場合だけチェックする
- Codexが推奨順序や完了判定を押し付けない

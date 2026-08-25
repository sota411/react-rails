# Lesson 5演習 — 100文字と101文字の境界

既存のModel testには「101文字は無効」があります。

あなたは「100文字は有効」を追加します。

## なぜ2本必要？

```text
99文字  成功
100文字 成功  ← 境界の内側
101文字 失敗  ← 境界の外側
```

101だけをtestしても、実装が「最大99文字」でもtestは成功します。100が成功することも固定します。

## Starter

`task_boundary_test.rb` のTODOを埋めた後、内容を次へ移します。

```text
backend/test/models/task_test.rb
```

## 実行

```bash
cd backend
bin/rails test test/models/task_test.rb
```

## 追加観察

Rails consoleで次を比べます。

```ruby
Task.new(title: "a" * 100).valid?
Task.new(title: "a" * 101).valid?
```

errorsも表示してください。

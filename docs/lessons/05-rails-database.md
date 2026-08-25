# Lesson 5 — Railsが保存する仕組み

## 今日の完成物

`Task` の保存ルールをRails consoleとtestの両方から確認し、「100文字は保存できる・101文字は保存できない」という境界のtestを完成させます。

## 0. 3つのファイルを区別する

| ファイル | 役割 | このアプリで見るもの |
|---|---|---|
| migration | DB構造を変える手順書 | `create_tasks.rb` |
| schema | 現在のDB構造の結果 | `db/schema.rb` |
| Model | 保存前に確認するルール | `app/models/task.rb` |

```text
migrationを実行
  ↓
DBの形が変わる
  ↓
schemaへ現在形が反映

Modelのvalidation
  ↓
1件ごとの値を保存してよいか判断
```

DBの列とModelのvalidationは似ていますが、同じものではありません。

## 1. migrationを読む

`backend/db/migrate/20260822000000_create_tasks.rb`:

```ruby
create_table :tasks do |t|
  t.string :title, null: false
  t.boolean :done, null: false, default: false
  t.timestamps
end
```

| 行 | 意味 |
|---|---|
| `create_table :tasks` | tasksという表を作る |
| `t.string :title` | title文字列の列 |
| `null: false` | DB上で値なしを許可しない |
| `default: false` | doneを送らなければfalse |
| `t.timestamps` | created_atとupdated_atを追加 |

## 2. schemaで実行後を確認

`backend/db/schema.rb` は、migrationを実行した結果です。通常は手で編集しません。

```bash
cd backend
bin/rails db:migrate

git diff db/schema.rb
```

新しいmigrationを作ったとき、schemaの差分を見る習慣を付けます。

## 3. Modelのvalidation

`backend/app/models/task.rb`:

```ruby
class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 100 }
end
```

```text
presence: true    空を許可しない
maximum: 100      100文字まで
```

validationは、`save` の前に自動で確認されます。

## 4. Rails consoleで手を動かす

```bash
cd backend
bin/rails console
```

### 保存前のobjectを作る

```ruby
task = Task.new(title: "consoleから作る")
```

まだDBにはありません。

```ruby
task.new_record?
# => true
```

### 保存する

```ruby
task.save
# => true
```

```ruby
task.new_record?
# => false
```

### 失敗を観察する

```ruby
invalid_task = Task.new(title: "")
invalid_task.save
# => false

invalid_task.errors.full_messages
```

失敗は例外とは限りません。`save` は成功・失敗をbooleanで返し、理由は `errors` へ入れます。

consoleを終了:

```ruby
exit
```

## 5. testで境界を固定する

対象:

```text
backend/test/models/task_test.rb
```

既に101文字を拒否するtestがあります。次を追加してください。

```text
100文字のtitleは有効
```

擬似コード:

```ruby
# 100文字のtitleでTaskを作る
# valid?がtrueであることを確認する
```

実行:

```bash
bin/rails test test/models/task_test.rb
```

### なぜ100と101を両方testする？

「最大100」の境界は、100が成功し、101が失敗して初めて確認できます。101だけでは、99までしか許可されない実装も通る可能性があります。

## 6. APIから422を見る

Railsを起動した状態で別Terminalから:

```bash
curl -i \
  -X POST http://localhost:3000/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"task":{"title":""}}'
```

見る場所:

```text
HTTP/1.1 422 Unprocessable Content

{"errors":[...]}
```

422は「Routeがない」ではありません。Railsは値を受け取りましたが、保存ルールに通らなかったという意味です。

## 7. Controllerの分岐へ戻る

```ruby
if task.save
  render json: task, status: :created
else
  render json: { errors: task.errors.full_messages },
         status: :unprocessable_entity
end
```

| `task.save` | 進む側 | status |
|---|---|---:|
| `true` | 成功 | 201 |
| `false` | 失敗 | 422 |

Modelの結果をControllerがHTTPの返事へ変換しています。

## よくある混同

### `null: false` があればvalidation不要？

DBは最後の防波堤です。Model validationは、ユーザーへ分かりやすいerrorsを返しやすくします。両方に意味があります。

### migrationを直せば既存DBも変わる？

一度実行済みのmigrationを書き換えるのではなく、通常は新しいmigrationを追加します。会社の運用ルールを優先してください。

## 理解度クイズ

```bash
node scripts/quiz.mjs 5
```

## Codexへ送る

```text
Lesson 5で100文字の境界testを書きました。
コードは変更せず、100文字と101文字の両方が必要な理由を
私に説明させる質問を1つください。
```

## 完了条件

- [ ] consoleで成功と失敗を作った
- [ ] errorsを確認した
- [ ] 100文字成功testを追加した
- [ ] 422をcurlまたはNetworkで確認した
- [ ] migration・schema・Modelの違いを言える

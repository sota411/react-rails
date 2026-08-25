# Code Tour 5 — Model・migration・Database

対象:

```text
backend/app/models/task.rb
backend/db/migrate/20260822000000_create_tasks.rb
backend/db/schema.rb
```

## 3つを一言で

```text
migration: DBの形をどう変えるかという手順
schema:    今のDBがどんな形かという結果
Model:     1件のデータをどう扱い、何を許可するかというルール
```

## migration

```ruby
① class CreateTasks < ActiveRecord::Migration[8.1]
②   def change
③     create_table :tasks do |t|
④       t.string :title, null: false
⑤       t.boolean :done, null: false, default: false
⑥       t.timestamps
⑦     end
⑧   end
⑨ end
```

### ① migration class

`[8.1]` は、このmigrationが使うRails migration APIのversionです。

### ② change

実行時にDBをどう変えるかを書きます。

### ③ tableを作る

Railsの慣習でModel名は単数 `Task`、table名は複数 `tasks` です。

### ④ title列

```text
型: string
null: false → DBで値なしを許可しない
```

空文字 `""` とNULLは同じではありません。空文字を拒否するのはModel validationも担当します。

### ⑤ done列

```text
型: boolean
値なし禁止
defaultはfalse
```

新規作成時にdoneを送らなくても未完了になります。

### ⑥ timestamps

次の2列を作ります。

```text
created_at  作成日時
updated_at  最終更新日時
```

一覧を新しい順に並べるため、created_atを使っています。

## migrationを実行

```bash
cd backend
bin/rails db:migrate
```

流れ:

```text
未実行migrationを探す
  ↓
changeをDBへ適用
  ↓
schemaを更新
```

## schema

```ruby
create_table "tasks", force: :cascade do |t|
  t.string "title", null: false
  t.boolean "done", default: false, null: false
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
end
```

schemaは現在の結果を機械が出力します。通常、列追加のためにschemaを直接編集しません。

確認:

```bash
git diff db/schema.rb
```

migration後に意図した列だけ増えたか見ます。

## Model

```ruby
class Task < ApplicationRecord
  validates :title, presence: true, length: { maximum: 100 }
end
```

### 継承

`< ApplicationRecord` により、DBを読む・作る・変える・消す機能を受け取ります。

```ruby
Task.all
Task.new(...)
Task.find(4)
task.save
task.update(...)
task.destroy!
```

### validation

```text
presence: true       空でない
maximum: 100         100文字以下
```

validationは `valid?`, `save`, `update` などで確認されます。

## objectの状態変化

```ruby
task = Task.new(title: "読む")
```

```text
Ruby object: ある
DB record:   まだない
new_record?: true
```

```ruby
task.save
```

成功後:

```text
Ruby object: id付き
DB record:   ある
new_record?: false
```

失敗:

```ruby
task = Task.new(title: "")
task.save
# false

task.errors.full_messages
# 失敗理由
```

## DB制約とModel validation

| 場所 | 例 | 目的 |
|---|---|---|
| DB | `null: false` | どの経路から書いても不正なNULLを防ぐ最後の境界 |
| Model | `presence: true` | 保存前に判断し、分かりやすいerrorsを返す |

片方だけで完全に同じ役割にはなりません。

## testを読む

```ruby
① test "title is required" do
②   task = Task.new(title: "")
③   assert_not task.valid?
④   assert task.errors[:title].any?
⑤ end
```

### ① 期待するルールを文にする

失敗時に何が壊れたか分かる名前にします。

### ② 境界値を作る

空文字を入力します。

### ③ 無効であること

`valid?` がfalseか確認します。

### ④ 理由の場所

何らかの別エラーではなく、titleのvalidationで失敗したかを確認します。

## priority追加時の旅

```text
migrationでpriority列
  ↓ db:migrate
schemaへpriority列
  ↓
Modelで許可値validation
  ↓
ControllerからTask.new
  ↓
DBへ保存
```

migrationだけでは、`urgent` を禁止するModelルールは作られません。Modelだけでは、DBにpriorityの保存場所がありません。

## 読解確認

1. migrationとschemaのどちらを手順として書きますか？
2. `Task.new` だけでDBへINSERTされますか？
3. `save` がfalseの理由はどこで読みますか？
4. `null: false` と `presence: true` は完全に同じですか？
5. priority列追加後、意図したDB変更をどのファイルのdiffで確認しますか？

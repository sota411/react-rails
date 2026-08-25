# コードツアー — 何から読めばよいか

コードを上から全部読む必要はありません。ユーザー操作を入口にして、呼ばれた順に移動します。

## 追加ボタンを追う順番

```text
TaskFormのonSubmit
  ↓
handleSubmit
  ↓ propsのonAdd
AppのhandleAdd
  ↓
api/tasks.jsのcreateTask
  ↓ fetch
Rails routes.rb
  ↓
TasksController#create
  ↓
Task Model
  ↓
Database
  ↓ JSON
AppのsetTasks
  ↓
TaskList → TaskItem
```

## 1つのコード片で答える3問

```text
1. 何を受け取る？
2. 何をする？
3. 何を次へ渡す？
```

分からない構文を全部調べる前に、この3問へ答えます。

## 読む資料

1. [Reactの入口から画面まで](01-react-app.md)
2. [入力フォームを1行ずつ読む](02-task-form.md)
3. [fetchによる通信を1行ずつ読む](03-api-client.md)
4. [RailsのRoute→Controllerを1行ずつ読む](04-rails-controller.md)
5. [Model・migration・DBを1行ずつ読む](05-model-database.md)

## Codexへコード読解を頼む型

```text
このfunctionを「受け取るもの / 行うこと / 次へ渡すもの」に分けてください。
構文を一度に全部説明せず、最初にデータの流れだけを3行で示してください。
その後、私に1行ずつ予想させてください。
```

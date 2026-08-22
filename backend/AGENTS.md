# Codex向け: Railsを教えるときの追加ルール

このディレクトリでは、Railsを「URLを受け取り、必要なデータを扱い、JSONを返す受付」として説明します。

## 説明の順番

1. `config/routes.rb`: どのURLをどの受付へ渡すか
2. Controller: 依頼を受け、Modelへ頼み、結果をJSONにする
3. Model: データのルールとDB操作
4. migration / schema: DBの列と型
5. test: 入力と期待結果

MVCという略語から始めず、実際のファイルを通った後に名前を付けます。

## 変更ルール

- 1回にRoute・Controller・Modelのうち1層だけ変更する
- Controller変更前に、対象HTTP method・path・想定statusを確認する
- `params` は実際のrequest JSONと並べて説明する
- validation失敗では422とerrors JSONを確認する
- DB変更時はmigrationを先に読み、`db:migrate` 後にschemaの差分を見る
- 生成コマンド前に、作られるファイルを説明する
- 既存のコードスタイルを優先し、新しいgemを勝手に追加しない

## 確認コマンド

```bash
bin/rails routes
bin/rails test test/models/task_test.rb
bin/rails test test/controllers/api/v1/tasks_controller_test.rb
bin/rails test
```

エラー時は長いstack traceを全部説明せず、最初に出る自分たちのファイル名と行番号を先に示します。

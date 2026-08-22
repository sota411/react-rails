# 初学者向け用語集

暗記用ではありません。コードで単語に出会ったとき、戻って確認する辞書です。

| 単語 | この教材での意味 | 具体例 |
|---|---|---|
| frontend | ユーザーが見る画面側 | `frontend/src/App.jsx` |
| backend | 画面からの依頼を受ける裏側 | `backend/` のRails |
| API | 画面と裏側がやり取りする窓口 | `/api/v1/tasks` |
| Component | Reactの画面部品 | `TaskForm`, `TaskItem` |
| JSX | JavaScriptの中に書く、HTMLに似た画面設計 | `<TaskForm />` |
| props | 親の部品から子へ渡す値 | `onAdd={handleAdd}` |
| state | Reactが画面用に覚える値 | `tasks`, `filter`, `title` |
| event | クリックや入力が起きたという知らせ | `onClick`, `onSubmit` |
| render | stateを使って画面を計算すること | `return (...)` |
| hook | Reactの機能を関数Componentで使う仕組み | `useState`, `useEffect` |
| function | 名前を付けた処理のまとまり | `handleAdd` |
| argument / 引数 | functionへ渡す具体的な値 | `handleAdd(title)` の `title` |
| return value / 戻り値 | functionが呼び出し元へ返す値 | `return newTask` |
| array / 配列 | 値を順番に並べたもの | `[task1, task2]` |
| object | 名前と値の組をまとめたもの | `{ title: "読む", done: false }` |
| map | 配列の各要素を、別の形へ変える | taskを`<TaskItem />`へ変える |
| filter | 条件に合う要素だけ残す | 未完了taskだけ残す |
| HTTP | ブラウザとサーバーが依頼と返事を送る約束 | GET, POST, PATCH, DELETE |
| method | HTTP依頼の種類 | POSTは新規作成 |
| path | 依頼の届け先 | `/api/v1/tasks` |
| request | ブラウザからRailsへの依頼 | method + path + body |
| response | Railsからブラウザへの返事 | status + JSON |
| status | HTTPの結果番号 | 200, 201, 404, 422, 500 |
| JSON | 通信でデータを運ぶ文字形式 | `{"task":{"title":"読む"}}` |
| fetch | ブラウザからHTTP通信する関数 | `fetch("/api/v1/tasks")` |
| async / await | 通信などの完了を待ちながら処理を書く方法 | `await response.json()` |
| Route | URLとControllerを結ぶ住所録 | `config/routes.rb` |
| Controller | requestを受け、処理を組み立て、responseを返す受付 | `TasksController#create` |
| Model | データのルールとDB操作を担当 | `Task` |
| Database / DB | データを永続的に保存する場所 | SQLiteのtasks表 |
| table | 同じ種類のデータを行と列で置く場所 | `tasks` |
| record | tableの1行 | 1件のtask |
| column | recordが持つ項目 | `title`, `done` |
| migration | DB構造を変更する手順書 | `create_tasks.rb` |
| schema | 現在のDB構造をまとめた結果 | `db/schema.rb` |
| validation | 保存してよい値か確認するルール | titleを空にしない |
| params | Railsがrequestから受け取った値 | `params[:id]` |
| strong parameters | Controllerが受け取りを許可する項目 | `permit(:title, :done)` |
| CRUD | 作る・読む・変える・消すの4操作 | Create, Read, Update, Delete |
| test | 入力と期待結果をコードで確認する仕組み | `assert_response :created` |
| Console | ブラウザ側のJavaScriptエラーを見る窓 | DevTools Console |
| Network | HTTP通信の内容を見る窓 | DevTools Network |
| log | Rails内部で通った処理の記録 | `Completed 201 Created` |
| terminal | コマンドを入力し、ログを見る画面 | `bin/rails server` |
| repository / Repo | プロジェクトのファイルと変更履歴のまとまり | このGitHubリポジトリ |
| commit | 変更をひとまとまりとして記録したもの | `git commit` |
| branch | 本流を壊さず作業する分岐 | `lesson-2-work` |
| PR / Pull Request | 変更内容を他の人にレビューしてもらう単位 | インターンでの提出 |

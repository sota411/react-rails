# Lesson 0 — 起動と全体の実行経路

## このLessonで確認すること

1件のtaskを追加し、次の処理が実際に起きたことを確認します。

```text
TaskForm.handleSubmit
→ App.handleAdd
→ createTask
→ POST /api/v1/tasks
→ TasksController#create
→ Task#save
→ 201 Created + JSON
→ setTasks
→ Reactの再レンダー
```

この一覧を暗記する必要はありません。
画面、Network、Railsログ、コードを対応付けられれば完了です。

## 1. 起動状態を確認する

このLessonは `./learn` から開始している前提です。
ブラウザに `http://localhost:5173` が開き、task一覧が表示されていればReactは動いています。

Railsの起動確認は、Codexが次を実行します。

```bash
curl --fail http://localhost:3000/api/v1/health
```

成功時はHTTP status 200とJSON responseが返ります。

## 2. 実行前に予想する

入力欄に `最初のrequestを追う` と入力し、まだ追加ボタンは押しません。

次のどちらを予想するか答えてください。

```text
A. 追加を押した直後、最初にTasksController#createが呼ばれる
B. 追加を押した直後、最初にTaskFormのsubmit handlerが呼ばれる
```

予想を残してから操作します。

## 3. 1件追加する

`追加` を押します。
画面の「実行経路」では、現在の処理段階が次の順に移動します。

```text
React event → HTTP request → Rails + SQLite → HTTP response → React state
```

この表示は教材側で設定した段階表示であり、実行時間を計測するtrace toolではありません。
正確なmethod、path、status、payloadはChrome DevToolsのNetworkで確認します。

## 4. Networkでrequestを確認する

Chrome DevToolsを開き、Networkから `/api/v1/tasks` を選びます。
最初は次の4項目だけ確認します。

```text
Request Method: POST
Request URL: http://localhost:5173/api/v1/tasks
Status Code: 201
Request Payload: { "task": { "title": "最初のrequestを追う" } }
```

Viteが `/api` をRailsへproxyしているため、browser上のURLは5173でも、requestはRails containerの3000番portへ転送されます。

## 5. Rails側の処理を確認する

Codexに「Railsログを確認」と伝えると、次を実行します。

```bash
docker compose logs backend --tail=80
```

次の対応を探します。

```text
POST /api/v1/tasks
→ Processing by Api::V1::TasksController#create
→ INSERT INTO "tasks"
→ Completed 201 Created
```

`INSERT` はDB tableへrowを追加するSQLです。

## 6. 画面へ戻る理由を確認する

Railsが返したtask JSONを `createTask` が返し、`App.handleAdd` が次を実行します。

```jsx
setTasks((currentTasks) => [newTask, ...currentTasks]);
```

`setTasks` はstateの更新を依頼します。
Reactは更新後の`tasks`を使って再レンダーし、新しいtaskを画面へ表示します。

## 確認問題

`setTasks(...)` の1行だけを削除し、POSTが201で成功したと仮定します。

- DBにはtaskが保存されますか
- 追加直後の画面にはtaskが表示されますか
- browserを再読み込みするとどうなりますか

Networkとstateの役割を分けて説明してください。

## 完了の判断

このLessonを完了にするかは学習者が決めます。
次の証拠を1つずつ確認できていれば、完了候補です。

- POST requestのmethod、path、payloadを見た
- status 201を見た
- RailsログでController actionとINSERTを見た
- `setTasks` が画面表示へつながる理由を説明した

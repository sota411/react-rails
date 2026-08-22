# Code Tour 4 — RailsのRouteからControllerまで

対象:

```text
backend/config/routes.rb
backend/app/controllers/api/v1/tasks_controller.rb
```

## POSTの経路

```text
POST /api/v1/tasks
  ↓ routes.rb
Api::V1::TasksController#create
  ↓ Task.new
Task Model
  ↓ task.save
Database
  ↓ render json
201 または 422
```

## Routeを展開する

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks, only: %i[index create update destroy]
    end
  end
end
```

`resources` が複数のRouteを作ります。

| method | path | Controller method | 意味 |
|---|---|---|---|
| GET | `/api/v1/tasks` | `index` | 一覧 |
| POST | `/api/v1/tasks` | `create` | 作成 |
| PATCH | `/api/v1/tasks/:id` | `update` | 更新 |
| DELETE | `/api/v1/tasks/:id` | `destroy` | 削除 |

実際の結果:

```bash
cd backend
bin/rails routes | grep api_v1
```

Routeは推測せず、コマンドで確認できます。

## moduleの入れ子

```ruby
module Api
  module V1
    class TasksController < ApplicationController
```

ファイル場所:

```text
app/controllers/api/v1/tasks_controller.rb
```

対応:

```text
api ディレクトリ ↔ module Api
v1 ディレクトリ  ↔ module V1
tasks_controller  ↔ class TasksController
```

## before_action

```ruby
before_action :set_task, only: %i[update destroy]
```

updateとdestroyの前に `set_task` を実行します。

なぜindex/createでは使わない？

- indexは全件を読む
- createはこれから新しく作る
- update/destroyはidで既存1件を探す

## index

```ruby
① def index
②   tasks = Task.order(created_at: :desc)
③   render json: tasks
④ end
```

```text
受け取る: GET /api/v1/tasks
行う:     新しい順でTaskを取得
返す:     task配列のJSON、status 200
```

`render` にstatusを書かない成功時は通常200です。

## create

```ruby
① def create
②   task = Task.new(task_params)

③   if task.save
④     render json: task, status: :created
⑤   else
⑥     render json: { errors: task.errors.full_messages },
⑦            status: :unprocessable_entity
⑧   end
⑨ end
```

### ① methodの入口

POST Routeから呼ばれます。

### ② Model objectを作る

まだ保存されていません。

```text
params → task_paramsで許可 → Task.new
```

### ③ save

Model validationを確認し、成功ならDBへINSERTします。

### ④ 成功

`:created` は201へ変換されます。保存後のtaskをJSONで返すため、DBが付けたidも含まれます。

### ⑤〜⑦ 失敗

`:unprocessable_entity` は422です。Modelのerrorsをユーザーへ返します。

## update

```ruby
① def update
②   if @task.update(task_params)
③     render json: @task
④   else
⑤     render json: { errors: @task.errors.full_messages },
⑥            status: :unprocessable_entity
⑦   end
⑧ end
```

`@task` はbefore_actionの `set_task` が用意します。

```ruby
def set_task
  @task = Task.find(params[:id])
end
```

### `params[:id]`

PATCH `/api/v1/tasks/4` の `4` が入ります。

`Task.find` で見つからない場合、ApplicationControllerの `rescue_from` が404 JSONへ変換します。

## destroy

```ruby
def destroy
  @task.destroy!
  head :no_content
end
```

`head :no_content` はstatus 204だけを返し、JSON bodyは返しません。

## strong parameters

```ruby
def task_params
  params.require(:task).permit(:title, :done)
end
```

Request:

```json
{
  "task": {
    "title": "Networkを見る",
    "done": false,
    "admin": true
  }
}
```

許可後:

```text
title: 受け取る
done:  受け取る
admin: 捨てる
```

入力値を全部そのままModelへ渡さないための境界です。

## Railsログとの対応

```text
Started POST "/api/v1/tasks"
Processing by Api::V1::TasksController#create
Parameters: {"task"=>{"title"=>"Networkを見る"}}
Task Create INSERT INTO ...
Completed 201 Created
```

| log | コード |
|---|---|
| Started | Routeへ入るrequest |
| Processing | Controller method |
| Parameters | params |
| INSERT | task.save |
| Completed | renderしたstatus |

## 読解確認

1. POST `/api/v1/tasks` はどのmethodへ届きますか？
2. `Task.new` の直後、DBへ保存済みですか？
3. blank titleのsaveがfalseなら、どのstatusを返しますか？
4. PATCHの対象idはどこから読みますか？
5. priorityを追加したのにpermitへ書かなかった場合、何が起きますか？

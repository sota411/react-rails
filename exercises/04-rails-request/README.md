# Lesson 4演習 — stats API

## 目標

```text
GET /api/v1/stats
```

```json
{
  "all": 3,
  "done": 1,
  "active": 2
}
```

## Starter test

`stats_controller_test.rb` を次へコピーします。

```text
backend/test/controllers/api/v1/stats_controller_test.rb
```

最初は404で失敗して正常です。

```bash
cd backend
bin/rails test test/controllers/api/v1/stats_controller_test.rb
```

## 赤いエラーを段階的に変える

1. Routeなし → 404
2. Routeだけ追加 → Controllerが見つからない
3. Controllerを追加 → 固定値なら件数で失敗
4. Taskを数える → 成功

エラーが変わるたび、「どこまで通ったか」を書いてください。

## 実装順

```text
test
  ↓
config/routes.rb
  ↓
app/controllers/api/v1/stats_controller.rb
  ↓
ブラウザでJSON
```

## 使えるModel操作

```ruby
Task.count
Task.where(done: true).count
Task.where(done: false).count
```

## 説明問題

```text
GET /api/v1/statsは、どのRouteから、どのControllerの、どのmethodへ届きますか？
```

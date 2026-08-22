# Lesson 0 — 全体地図と起動

![9駅のコースマップ](../visuals/00-course-map.svg)

## 今日のゴール

終わったとき、次の3つを指させれば合格です。

- ユーザーが見る画面は `frontend/`
- 依頼を受けるRailsは `backend/`
- ReactとRailsは `/api/v1/tasks` で通信する

まだコードを暗記しません。まず「どこに何があるか」を体で覚えます。

## 0. 動かす前に予想

次の順番を、自分が正しいと思うように並べてください。

```text
A. DBへ保存
B. Reactのボタンを押す
C. RailsのControllerが動く
D. Reactの画面が描き直される
```

答えは実際の操作で確認します。Codexへ答えを聞く前に、紙か `PROGRESS.md` に予想を残してください。

## 1. 起動する

### Dockerを使う場合

リポジトリの一番上で実行します。

```bash
docker compose up --build
```

初回はgemとnpm packageを取得するため、ログが多く流れます。次の2行が見つかれば起動済みです。

```text
Local: http://localhost:5173/
Listening on http://0.0.0.0:3000
```

### Dockerを使わない場合

必要なもの:

- Ruby 3.3以降
- Bundler
- Node.js 22以降
- npm

Terminal 1:

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails db:seed
bin/rails server
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

> **Terminal（ターミナル）**は、文字でコンピューターへ指示する画面です。2つ開くのは、ReactとRailsを別々に動かすためです。

## 2. 3つの窓を開く

| 窓 | 開く場所 | 何が分かるか |
|---|---|---|
| React画面 | `http://localhost:5173` | ユーザーが見ている結果 |
| Rails API | `http://localhost:3000/api/v1/health` | Railsが起動しているか |
| Railsログ | backendを起動したTerminal | URLがどの処理へ届いたか |

Rails APIで次が表示されれば成功です。

```json
{
  "status": "ok",
  "message": "Rails API is running"
}
```

## 3. 最初の1件を追加する

1. React画面へ `RouteからControllerを探す` と入力
2. `追加` を押す
3. 画面上部の「処理のX線モード」を見る
4. Railsログで `Started POST` を探す
5. ページを再読み込みし、追加した項目が残ることを確認

### 観察メモ

| 観察する場所 | 見つける文字 |
|---|---|
| React画面 | 追加したタイトル |
| X線モード | React → HTTP → Rails + DB → JSON → state |
| Railsログ | `POST "/api/v1/tasks"` |
| 再読み込み後 | 追加した項目がまだある |

再読み込み後も残るのは、Reactの一時的なstateだけでなくDBへ保存したからです。

## 4. Networkを初めて見る

Chromeで `F12` → `Network` を開きます。画面でもう1件追加し、一覧から `tasks` を選びます。

最初は次の4項目だけ見ます。

```text
Request Method: POST
Request URL: .../api/v1/tasks
Status Code: 201
Request Payload: task.title
```

全部の項目を理解する必要はありません。「画面操作が通信になった証拠」を見つけるのが目的です。

## 5. 操作できる図解

`docs/visual-lab/index.html` をブラウザで開きます。

- `次へ` で1段階ずつ進む
- `レストラン比喩` で同じ処理を別の見方にする
- 各段階の「止まって考える」に口頭で答える

## 6. 手を動かすチェック

- [ ] React画面を開いた
- [ ] health APIを開いた
- [ ] 1件追加した
- [ ] 再読み込み後も残った
- [ ] NetworkでPOSTと201を見た
- [ ] RailsログでController名を見た

## 7. 理解度クイズ

```bash
node scripts/quiz.mjs 0
```

80%未満でも失敗ではありません。間違えた問題の解説を、自分の言葉に直して `PROGRESS.md` へ書きます。

## Codexへ送る

```text
Lesson 0を進めています。コードは変更しないでください。
私が追加ボタンを押した後の順番を説明するので、
合っている部分と、まだ曖昧な部分だけ指摘してください。

私の説明:
（ここへ書く）
```

## 完了条件

```text
入力: ユーザーがタイトルを入力して追加を押す
処理: ReactがHTTPでRailsへ送り、RailsがDBへ保存する
出力: JSONが戻り、Reactがstateを更新して画面に表示する
```

この形を丸暗記せず、自分の言葉で言えたらLesson 1へ進みます。

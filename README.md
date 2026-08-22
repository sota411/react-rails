# React × Rails はじめての実務ハンズオン

> **読む教材ではなく、手を動かして「画面からDBまで」を一本につなぐ教材です。**

ReactもRailsも初めてで、プログラミング用語にもまだ慣れていない人が、インターンで既存コードへ入る前に使う練習場です。

完成品は「Task Bridge」という小さなタスク帳です。入力して追加ボタンを押したとき、処理が次の順に進むことを、画面・コード・Network・Railsログで確かめます。

```text
Reactの入力欄
  ↓ クリック
Reactの関数
  ↓ HTTP通信
RailsのRoute → Controller → Model → DB
  ↓ JSONで返事
Reactのstateが変わる
  ↓
画面が描き直される
```

## 最初にやること

### 1. 取得

```bash
git clone https://github.com/sota411/react-rails.git
cd react-rails
git switch feat/beginner-hands-on-course
```

### 2. 起動

Dockerが使える場合:

```bash
docker compose up --build
```

起動後:

- React画面: `http://localhost:5173`
- Rails確認用API: `http://localhost:3000/api/v1/health`
- 操作できる図解: `docs/visual-lab/index.html`

Dockerを使わない起動方法は [Lesson 0](docs/lessons/00-start.md) にあります。

### 3. Codexを先生役で開始

Codexへ送る文章:

```text
このリポジトリの AGENTS.md と PROGRESS.md を読んでください。
Lesson 0を先生役として開始してください。
最初はコードを変更せず、確認問題を1つだけ出してください。
英語の技術用語には、その場で短い日本語の意味を添えてください。
```

## 毎回同じ学習ループ

![予想、実装、観察、説明、確認を回す学習ループ](docs/visuals/01-learning-loop.svg)

1. **予想する**: 実行前に何が起きるか言う
2. **小さく書く**: 1回につき1つのTODOだけ直す
3. **観察する**: 画面、Console、Network、Railsログを見る
4. **説明する**: 「何を受け取り、何をし、何を返したか」を言う
5. **確認する**: クイズと自動テストを通す

## コース

| Lesson | 手を動かして確かめるもの | 主な新語 |
|---|---|---|
| [0. 全体地図と起動](docs/lessons/00-start.md) | 画面・API・ログを同時に開く | frontend、backend、API |
| [1. JavaScriptの最低限](docs/lessons/01-javascript.md) | 配列から未完了タスクを取り出す | 変数、配列、関数 |
| [2. Reactの部品](docs/lessons/02-react-components.md) | タスクカードを部品にする | JSX、Component、props |
| [3. Reactが覚える仕組み](docs/lessons/03-react-state.md) | クリックで表示を変える | state、event、再描画 |
| [4. Railsが受付する仕組み](docs/lessons/04-rails-request.md) | URLからControllerへ到達する | Route、Controller、JSON |
| [5. Railsが保存する仕組み](docs/lessons/05-rails-database.md) | DB保存と失敗を観察する | Model、migration、validation |
| [6. ReactとRailsをつなぐ](docs/lessons/06-connect.md) | GET・POSTの往復を追う | HTTP、fetch、status |
| [7. 機能を縦に通す](docs/lessons/07-priority-feature.md) | priorityをDBから画面まで追加 | strong parameters、vertical slice |
| [8. 模擬インターン](docs/lessons/08-debug-internship.md) | 5つの故障を証拠から直す | Console、Network、log、PR |

時間が少ない場合は **0 → 2 → 3 → 4 → 6 → 8** の順で進めます。

## 理解度クイズ

各Lessonの最後に3〜5問あります。CLIでも採点できます。

```bash
node scripts/quiz.mjs --list
node scripts/quiz.mjs 2
```

`2` はLesson 2です。正解だけでなく、なぜそうなるかも表示します。

進捗確認:

```bash
node scripts/progress.mjs
```

## コードを1行ずつ読む

- [Reactの入口から画面まで](docs/code-tour/01-react-app.md)
- [入力フォーム](docs/code-tour/02-task-form.md)
- [fetchによる通信](docs/code-tour/03-api-client.md)
- [RailsのRoute→Controller](docs/code-tour/04-rails-controller.md)
- [Model・migration・DB](docs/code-tour/05-model-database.md)

コード片には番号を付け、各行を次の3点で説明します。

1. 何を受け取るか
2. 何をするか
3. 何を次へ渡すか

## 視覚で理解する

### 操作できる図解

`docs/visual-lab/index.html` をブラウザで開きます。「追加」を押した後のデータの旅を1段階ずつ再生できます。

### 静止画

- [コースマップ](docs/visuals/00-course-map.svg)
- [レストランに見立てたリクエストの流れ](docs/visuals/02-request-restaurant.svg)
- [state変更前後](docs/visuals/03-react-state-before-after.svg)
- [NetworkとRailsログの対応](docs/visuals/04-network-log-xray.svg)
- [priority機能の縦断面](docs/visuals/05-priority-vertical-slice.svg)
- [バグ調査で見る4つの窓](docs/visuals/06-debug-four-windows.svg)

## Codexを答え製造機にしない

| モード | Codexがしてよいこと | してはいけないこと |
|---|---|---|
| `coach` | 質問、図解、ヒント、用語説明 | コード変更、完成解の提示 |
| `pair` | 説明済みのTODOを1つだけ編集 | 複数ファイルを一気に完成 |
| `reviewer` | 差分レビュー、テスト、原因候補整理 | 代わりに修正 |
| `implementer` | 最終課題で合意済み設計を実装 | 未説明の設計変更、依存追加 |

現在のモードは [PROGRESS.md](PROGRESS.md) で変えます。

## インターン前の完成条件

全構文の暗記は不要です。次ができれば十分です。

- ボタンを押したとき、最初に動く関数を探せる
- `props` と `state` を「渡された値」「画面が覚える値」と言い分けられる
- URLからRailsのRouteとControllerを探せる
- Networkの結果番号が404・422・500のどれか確認できる
- 観察した証拠を添えて質問できる

## 参考資料

- React公式 Learn: https://react.dev/learn
- Rails公式 Getting Started: https://guides.rubyonrails.org/getting_started.html
- Rails公式 API-only Applications: https://guides.rubyonrails.org/api_app.html
- Codex公式 AGENTS.md: https://developers.openai.com/codex/guides/agents-md
- 学習ハーネス設計の着想: https://qiita.com/WdknWdkn/items/fe4b1810f45e4b6df166

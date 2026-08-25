# 学習セッションの入口

このリポジトリの開始操作は `./learn` だけです。
Docker、Rails、npm、クイズを個別に起動する必要はありません。

## 開始後の操作

CodexがLesson一覧を表示したら、学びたい番号を1つ返します。
順番どおりに進める必要はなく、途中のLessonから始めても構いません。

| Lesson | 手を動かして確認すること |
|---:|---|
| 0 | React画面、Rails API、DB保存が動いていることを確認する |
| 1 | JavaScriptの関数と配列操作をtestで確認する |
| 2 | React Componentとpropsで表示を分割する |
| 3 | stateを更新し、再レンダーが起きることを確認する |
| 4 | RailsのRouteとControllerをtestから実装する |
| 5 | Model、validation、migration、DB制約を確認する |
| 6 | POST requestをReactからRails、DB、responseまで追跡する |
| 7 | priority項目をDBからReact画面まで通して追加する |
| 8 | 404、422、保存漏れをNetworkとRailsログから切り分ける |

選んだ後は、Codexが一度に1つの操作だけを示します。
次へ進むか、説明を求めるか、クイズを行うか、Lessonを終了するかは学習者が決めます。

## 説明の基準

説明では、専門用語を別の物語へ置き換えません。
正確な用語を残し、初出時に短い日本語の定義を添えます。

たとえば `state` は「画面が覚えるもの」だけで終わらせず、次のように説明します。

> `state` はReactがComponentごとに保持する値です。setterで更新すると、ReactはそのComponentの再レンダーを予定します。

説明は必ず、実際のfile path、function名、request method、URL、status、dataの変化へ結びつけます。

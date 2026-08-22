# Lesson 8 — バグ調査と模擬インターン

![4つの窓を左から調べる](../visuals/06-debug-four-windows.svg)

## 想定

インターン初日、既存のTask Bridgeで不具合が報告されました。

```text
「タスク一覧が急に表示されなくなりました。昨日までは動いていました」
```

あなたの仕事は、すぐ修正案を出すことではありません。

1. 再現する
2. どの層まで正常か証拠を集める
3. 原因を狭める
4. 最小修正する
5. testと再現手順で確認する
6. チームへ共有する

## 0. 作業branch

```bash
git switch -c practice/debug-lab
```

現在の変更がある場合は、先にcommitまたはstashします。bug-labは対象ファイルのbackupを作りますが、Gitの履歴も使います。

## 1. 故障を選ぶ

一覧:

```bash
node scripts/bug-lab.mjs --list
```

最初は `404-path` を推奨します。

```bash
node scripts/bug-lab.mjs 404-path --apply
```

他の故障:

| id | 表面の症状 | 主に見る場所 |
|---|---|---|
| `404-path` | 一覧を取得できない | Network path / Route |
| `422-empty-title` | 何を入力しても追加失敗 | Payload / Model errors |
| `silent-toggle` | 完了を押しても再読込で戻る | Payload / permit / DB |
| `shape-crash` | 画面が白くなりConsole error | response形 / state |

最初から原因欄を見ず、症状だけで開始します。

## 2. 再現メモ

```text
操作:
期待:
実際:
再現率:
環境:
```

例:

```text
操作: http://localhost:5173 を再読み込み
期待: 3件のtaskが表示
実際: エラーカードが表示
再現率: 3/3
環境: Chrome, Docker Compose
```

## 3. 4つの窓を左から見る

### 画面

何が起きなかったかを1文にします。

### Console

JavaScriptが途中で止まっていないか確認します。

### Network

```text
method:
path:
status:
request:
response:
```

### Railsログ

```text
Started:
Processing by:
Parameters:
Completed:
```

## 4. 「どこまで正常か」を宣言

悪い例:

```text
Railsが怪しいです。
```

良い例:

```text
ReactのloadTasksはGETを送信している。
ただしpathが/api/v1/taskzでstatus 404。
RailsログにTasksController#indexは出ていないため、Route到達前のpath誤りを疑う。
```

証拠が含まれています。

## 5. 原因候補を3つまで出す

優先順位も付けます。

```text
1. API pathのtypo — Networkの実値が期待と違う
2. Route削除 — bin/rails routesで確認可能
3. proxy設定 — Railsログへ全く届かない場合
```

候補を10個並べるより、次の観察で消せる候補を少数にします。

## 6. 最小修正

原因行だけ直します。ついでの命名変更やCSS整理を混ぜません。

修正前にCodexへ:

```text
証拠から原因候補を整理しました。コードはまだ変更せず、
私の推論に飛躍がないかレビューしてください。

再現:
証拠:
どこまで正常か:
原因候補:
```

## 7. 確認

最低限:

- 同じ手順で再現しない
- Console errorなし
- 対象Networkが2xx
- Railsログが期待Controllerを通る
- 関連test成功

```bash
cd frontend && npm test
cd ../backend && bin/rails test
```

## 8. 元へ戻す

別の故障へ進む前:

```bash
node scripts/bug-lab.mjs 404-path --revert
```

状態確認:

```bash
node scripts/bug-lab.mjs --status

git diff
```

## 9. チーム共有を書く

```text
症状:
原因:
証拠:
修正:
確認:
影響範囲:
再発防止:
```

例:

```text
症状: 初回一覧GETが404で画面表示不可
原因: frontend API pathがtasksではなくtaskz
証拠: Network GET /api/v1/taskz = 404。Controller#index未到達
修正: 定数TASKS_PATHを/api/v1/tasksへ戻した
確認: GET 200、一覧表示、frontend test成功
影響範囲: task CRUD全てが同じ定数を利用
再発防止: API clientのpathを検証するtestを追加検討
```

## 10. 模擬PR checklist

- [ ] 変更理由がdiffから分かる
- [ ] unrelatedな変更がない
- [ ] 再現手順がある
- [ ] 修正後の確認結果がある
- [ ] errorを握りつぶしていない
- [ ] testが追加または既存test成功
- [ ] 自分でコードを説明できる

## 理解度クイズ

```bash
node scripts/quiz.mjs 8
```

## 最終口頭試験

Codexに次を送ります。

```text
React × Railsインターン前の口頭試験をしてください。
AGENTS.mdに従い、1問ずつ出してください。
範囲はprops、state、POSTの経路、404/422/500の切り分け、
priority機能の縦断設計です。
私の回答後、正誤だけでなく不足している観察視点を返してください。
全8問の最後に、弱いLessonを番号で示してください。
```

## コース完了条件

- [ ] 4つのうち2つ以上の故障を証拠から修正
- [ ] 修正前に「どこまで正常か」を書いた
- [ ] 共有文を1件作った
- [ ] quiz 8で80%以上
- [ ] `PROGRESS.md` の全Lessonを自分で更新

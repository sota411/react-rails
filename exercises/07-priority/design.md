# priority機能 — 実装前の縦断設計

このファイルを埋めるまでは、Codexを `implementer` に変えません。

## ユーザーから見える完成形

```text
（どこで選び、どこに表示されるか）
```

## 許可する値

| 保存値 | 日本語表示 | 色以外の見分け方 |
|---|---|---|
| `low` |  |  |
| `normal` |  |  |
| `high` |  |  |

## 初期値

```text
未指定時:
新規フォームを開いた時:
追加成功後:
```

## データの旅

| 層 | 入力 | 行う変更 | 出力 | 確認方法 |
|---|---|---|---|---|
| React form |  |  |  |  |
| App handler |  |  |  |  |
| API client |  |  |  | Network |
| Route |  |  |  |  |
| Controller |  |  |  | controller test |
| Model |  |  |  | model test |
| Database |  |  |  | schema / console |
| GET response |  |  |  | Network |
| TaskItem |  |  |  | 再読み込み後の画面 |

## 変更するファイル候補

```text
DB:
Model:
Controller:
Frontend API:
React form:
React item:
Tests:
```

## 今回変更しなくてよい層

```text
（理由も書く）
```

## 失敗パターンの予想

| 糸が切れる場所 | ユーザーから見える症状 | 見る証拠 |
|---|---|---|
| form → handler |  |  |
| API body |  |  |
| Controller permit |  |  |
| Model validation |  |  |
| DB column |  |  |
| response → item |  |  |

## 実装順と理由

```text
1.
2.
3.
4.
```

## 受け入れ条件

- [ ] low / normal / highを選べる
- [ ] 未指定はnormal
- [ ] DBへ保存
- [ ] 再読み込み後も同じ
- [ ] 不正値は422
- [ ] Model test
- [ ] Controller test
- [ ] 既存CRUDが動く

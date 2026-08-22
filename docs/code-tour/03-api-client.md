# Code Tour 3 — fetchによる通信を1行ずつ読む

対象:

```text
frontend/src/api/tasks.js
```

## このファイルの仕事

画面ComponentへHTTPの細部を散らさず、task APIとの通信を1か所へ集めます。

```text
受け取る: title、task、id
行う:     fetchでrequestを送る
返す:     JSONから作ったJavaScriptの値、またはError
```

## 共通のpath

```js
① const TASKS_PATH = "/api/v1/tasks";
```

GET・POSTは同じpathを使います。PATCH・DELETEでは末尾へidを付けます。

```text
/api/v1/tasks
/api/v1/tasks/4
```

## POSTを1行ずつ

```js
① export async function createTask(title, reportStage = () => {}) {
②   reportStage("sending");

③   const response = await fetch(TASKS_PATH, {
④     method: "POST",
⑤     headers: {
⑥       "Content-Type": "application/json",
⑦       Accept: "application/json",
⑧     },
⑨     body: JSON.stringify({ task: { title } }),
⑩   });

⑪   reportStage("receiving");
⑫   return readJson(response);
⑬ }
```

### ① 引数

- `title`: TaskFormで入力した文字
- `reportStage`: X線モードの現在地を変えるfunction
- `= () => {}`: 渡されなかった場合の何もしないfunction

### ③ fetch

`fetch(path, options)` でHTTP requestを作ります。awaitでresponseを待ちます。

### ④ method

POSTは新しいresourceを作る依頼です。

### ⑤〜⑦ headers

```text
Content-Type: 送るbodyはJSON
Accept:       返事はJSONがほしい
```

headersは荷物の内容を示すラベルです。

### ⑨ JSON.stringify

JavaScript object:

```js
{ task: { title: "Networkを見る" } }
```

通信で送れるJSON文字列:

```json
{"task":{"title":"Networkを見る"}}
```

Railsの `params.require(:task)` に合わせ、外側をtaskで包みます。

### ⑫ readJson

成功・失敗の共通処理へresponseを渡します。

## readJsonを1行ずつ

```js
① async function readJson(response) {
②   const contentType = response.headers.get("content-type") || "";
③   const hasJsonBody = contentType.includes("application/json");
④   const body = hasJsonBody ? await response.json() : null;

⑤   if (response.ok) {
⑥     return body;
⑦   }

⑧   const railsMessages = body?.errors;
⑨   const message = Array.isArray(railsMessages)
⑩     ? railsMessages.join(" / ")
⑪     : `通信に失敗しました（結果番号: ${response.status}）`;

⑫   const error = new Error(message);
⑬   error.status = response.status;
⑭   throw error;
⑮ }
```

### ②〜④ bodyを読む

responseがJSONだと分かった場合だけ `response.json()` を呼びます。

`response.json()` は名前に反して、JSON文字列をJavaScript objectへ変換して返します。

### ⑤ response.ok

statusが200〜299ならtrueです。

### ⑧ `body?.errors`

`?.` は、bodyがnullでもそこで例外にせずundefinedを返すoptional chainingです。

長く書くなら:

```js
const railsMessages = body ? body.errors : undefined;
```

### ⑨〜⑪ messageを決める

Railsがerrors配列を返した場合は、その内容をつなぎます。それ以外はstatus付きの一般メッセージです。

### ⑫〜⑭ Errorを投げる

```text
readJsonがthrow
  ↓
createTaskも途中で失敗
  ↓
App.handleAddのcatchへ移動
  ↓
errorMessage state
  ↓
画面のerror-card
```

## DELETEだけ違う理由

```js
const response = await fetch(`${TASKS_PATH}/${taskId}`, {
  method: "DELETE",
});

if (!response.ok) {
  throw new Error(...);
}
```

成功statusは204で、bodyがありません。そのため成功時に `readJson(response)` を呼びません。

## template literal

```js
`${TASKS_PATH}/${taskId}`
```

バッククォート内の `${...}` に値を埋め込みます。

```text
taskId = 4
  ↓
/api/v1/tasks/4
```

## Networkとの対応

| コード | Networkで見る項目 |
|---|---|
| `TASKS_PATH` | Request URL |
| `method` | Request Method |
| `headers` | Request Headers |
| `body` | Request Payload |
| `response.status` | Status Code |
| `response.json()` | Response |

## 読解確認

1. POSTのbodyに外側のtask objectが必要な理由は何ですか？
2. response.okがfalseなら、最終的にAppのどこへ移りますか？
3. DELETE成功時にreadJsonを使わない理由は何ですか？
4. PATCHのpathには、一覧GETと違って何が追加されますか？

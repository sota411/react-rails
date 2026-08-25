# React × Rails 用語の正確な短縮定義

必要な項目だけ読み、説明へ一度に詰め込まないでください。

## React

- **Component**: JSXを返すJavaScriptの関数です。Reactはその戻り値を使って、画面に必要な要素を計算します。
- **props**: 親Componentが子Componentへ渡す値または関数です。子Componentは受け取ったpropsを読み取り専用として扱います。
- **state**: ReactがComponentごとに保持する値です。setterで更新すると、そのComponentの再レンダーが予定されます。
- **render / re-render**: ReactがComponent関数を実行し、前回との差分から必要なDOM更新を計算する処理です。再レンダーはDOM全体の作り直しと同義ではありません。
- **event handler**: clickやsubmitなどのbrowser eventが発生したときに呼ばれる関数です。
- **Effect**: 画面への反映後に、通信などReact外部との同期を行う処理です。`useEffect` の依存配列が再実行条件を決めます。

## HTTP / JSON

- **HTTP request**: clientからserverへ送る依頼です。method、URL、headers、必要ならbodyを含みます。
- **HTTP response**: serverがrequestへ返す結果です。status code、headers、必要ならbodyを含みます。
- **method**: requestの目的を表す値です。この教材ではGET、POST、PATCH、DELETEを使います。
- **status code**: requestの結果を3桁の数値で表したものです。たとえば201は作成成功、404は対応するresourceがない、422は受け取った内容を処理できないことを示します。
- **JSON**: objectやarrayを文字列として表現するdata形式です。JSON自体は通信方法ではなく、HTTP bodyで使える形式の1つです。
- **API**: software同士が機能やdataをやり取りするために公開された入口と規則です。

## Rails

- **Route**: HTTP methodとpathの組み合わせをController actionへ対応付ける規則です。
- **Controller action**: requestを受け、入力を確認し、Modelを呼び、HTTP responseを作るControllerのmethodです。
- **Model**: この教材ではActive Recordのclassです。DB tableのrowをRuby objectとして扱い、data ruleやqueryを表現します。
- **migration**: DB schemaの変更を順序付きで記録するRuby fileです。
- **schema**: 現時点のtable、column、型などの構造です。
- **validation**: Modelを保存する前に値が条件を満たすか確認するapplication側の規則です。
- **DB constraint**: NOT NULLなど、DB自身が保存時に強制する規則です。validationとは実行場所が異なります。
- **strong parameters**: Controllerがrequest parametersのうち受け入れるfieldを明示する仕組みです。Modelのvalidationとは別の役割です。

## Database

- **table**: 同じ種類のdataをrowとcolumnで保存する構造です。
- **row**: table内の1件のrecordです。
- **column**: 各recordが持つ項目とdata typeを定義します。
- **transaction**: 複数のDB操作を、すべて成功させるかすべて取り消す単位として扱う仕組みです。

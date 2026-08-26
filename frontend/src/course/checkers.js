function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/gm, "$1");
}

function result(checks) {
  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}

function includesPattern(code, pattern) {
  return pattern.test(stripComments(code));
}

export function evaluateCode(checkerId, sourceCode) {
  const code = stripComments(sourceCode);

  switch (checkerId) {
    case "react-props": {
      const functionArguments = code.match(/function\s+TaskCount\s*\(([^)]*)\)/s)?.[1] ?? "";
      const destructuresObject = /\{[\s\S]*\}/.test(functionArguments);

      return result([
        {
          label: "TaskCountがpropsをobjectとして受け取る",
          passed: destructuresObject,
          hint: "function TaskCount(ここ) の引数を確認してください。",
        },
        {
          label: "doneをpropsから受け取る",
          passed: /\bdone\b/.test(functionArguments),
          hint: "引数の { } の中へ done を追加します。",
        },
        {
          label: "totalをpropsから受け取る",
          passed: /\btotal\b/.test(functionArguments),
          hint: "引数の { } の中へ total を追加します。",
        },
        {
          label: "JSXがdoneを表示する",
          passed: /\{\s*done\s*\}/.test(code),
          hint: "固定値ではなく、JSXの中で {done} を参照します。",
        },
        {
          label: "JSXがtotalを表示する",
          passed: /\{\s*total\s*\}/.test(code),
          hint: "固定値ではなく、JSXの中で {total} を参照します。",
        },
      ]);
    }

    case "react-state": {
      const directToggle = /setOpen\s*\(\s*!\s*open\s*\)/.test(code);
      const updaterToggle = /setOpen\s*\(\s*\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>\s*!\s*\1\s*\)/.test(code);

      return result([
        {
          label: "open stateをuseStateで定義している",
          passed: /const\s*\[\s*open\s*,\s*setOpen\s*\]\s*=\s*useState\s*\(\s*false\s*\)/.test(code),
          hint: "const [open, setOpen] = useState(false) を残してください。",
        },
        {
          label: "handleClickがsetOpenを呼ぶ",
          passed: /function\s+handleClick\s*\([^)]*\)\s*\{[\s\S]*setOpen\s*\(/.test(code),
          hint: "handleClickの中でsetOpenを呼びます。",
        },
        {
          label: "現在値を反転して次のstateにする",
          passed: directToggle || updaterToggle,
          hint: "setOpen(!open) または setOpen(current => !current) の形を確認してください。",
        },
        {
          label: "buttonがhandleClickをevent handlerとして使う",
          passed: /onClick\s*=\s*\{\s*handleClick\s*\}/.test(code),
          hint: "buttonのonClickへhandleClickを渡します。",
        },
      ]);
    }

    case "rails-route":
      return result([
        {
          label: "GET /api/v1/stats のRouteを定義する",
          passed: /get\s+["']stats["']/.test(code),
          hint: "api/v1 namespaceの中で get \"stats\" を定義します。",
        },
        {
          label: "StatsController#showへ接続する",
          passed: /to:\s*["']stats#show["']/.test(code),
          hint: "to: \"stats#show\" を指定します。",
        },
      ]);

    case "rails-controller":
      return result([
        {
          label: "show actionを定義する",
          passed: /def\s+show\b/.test(code),
          hint: "StatsControllerの中に def show を定義します。",
        },
        {
          label: "Taskの件数を取得する",
          passed: /Task\.count/.test(code),
          hint: "Active RecordのTask.countを使います。",
        },
        {
          label: "JSON responseを返す",
          passed: /render\s+json:/.test(code),
          hint: "render json: { ... } の形で返します。",
        },
        {
          label: "responseにcountというkeyを含める",
          passed: /count\s*:/.test(code),
          hint: "JSON objectへ count: Task.count を入れます。",
        },
      ]);

    case "rails-validation":
      return result([
        {
          label: "titleを検証対象にする",
          passed: /validates\s+:title\b/.test(code),
          hint: "validates :title から書き始めます。",
        },
        {
          label: "titleが空でないことを要求する",
          passed: /presence:\s*true/.test(code),
          hint: "presence: true を指定します。",
        },
      ]);

    case "fullstack-fetch":
      return result([
        {
          label: "正しいpathへrequestを送る",
          passed: /fetch\s*\(\s*["']\/api\/v1\/tasks["']/.test(code),
          hint: "pathは /api/v1/tasks です。taskzではありません。",
        },
        {
          label: "HTTP methodをPOSTにする",
          passed: /method\s*:\s*["']POST["']/.test(code),
          hint: "新規作成にはmethod: \"POST\"を使います。",
        },
        {
          label: "JSONを送るContent-Typeを指定する",
          passed: /["']Content-Type["']\s*:\s*["']application\/json["']/.test(code),
          hint: "headersにContent-Type: application/jsonを残します。",
        },
        {
          label: "bodyをJSON文字列へ変換する",
          passed: /body\s*:\s*JSON\.stringify\s*\(/.test(code),
          hint: "bodyにはJSON.stringify(...)の結果を渡します。",
        },
        {
          label: "Railsが期待するtask.titleの形で送る",
          passed: /JSON\.stringify\s*\(\s*\{\s*task\s*:\s*\{\s*title\s*\}\s*\}\s*\)/s.test(code),
          hint: "bodyは { task: { title } } という入れ子です。",
        },
      ]);

    default:
      return result([
        {
          label: "このStepのcheckerが存在する",
          passed: false,
          hint: `不明なchecker: ${checkerId}`,
        },
      ]);
  }
}

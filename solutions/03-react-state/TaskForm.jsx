import { useState } from "react";

export default function TaskForm({ onAdd, disabled }) {
  const [title, setTitle] = useState("");
  const [showHint, setShowHint] = useState(true);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle === "") {
      return;
    }

    const added = await onAdd(trimmedTitle);
    if (added) {
      setTitle("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">次にやること</label>

      <div className="task-form__row">
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例: RouteからControllerを探す"
          maxLength={100}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || title.trim() === ""}>
          <span aria-hidden="true">＋</span>
          追加
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowHint((current) => !current)}
      >
        {showHint ? "説明を隠す" : "説明を表示"}
      </button>

      {showHint && (
        <p className="task-form__hint">
          入力中の文字はReactのstate、追加後のタスクはRailsのDBに保存されます。
        </p>
      )}
    </form>
  );
}

/*
showHintの旅:

クリック
  ↓ onClick
setShowHint(current => !current)
  ↓ stateがtrue/falseで反転
ReactがJSXを再計算
  ↓
説明文とbutton文字が変わる

ここでtitleは変更していないため、入力中の文字は残ります。
*/

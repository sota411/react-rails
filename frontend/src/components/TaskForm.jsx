import { useState } from "react";

export default function TaskForm({ onAdd, disabled }) {
  // titleは、入力欄の現在の文字を覚えるstateです。
  const [title, setTitle] = useState("");

  async function handleSubmit(event) {
    // form本来の「ページを再読み込みする動き」を止めます。
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
      <p className="task-form__hint">
        入力中の文字はReactのstate、追加後のタスクはRailsのDBに保存されます。
      </p>
    </form>
  );
}

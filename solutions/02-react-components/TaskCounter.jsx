export default function TaskCounter({ done, all }) {
  return (
    <div className="counter" aria-label="タスクの件数">
      <strong>{done}</strong>
      <span>/ {all} 完了</span>
    </div>
  );
}

/*
App.jsxでの呼び出し:

import TaskCounter from "./components/TaskCounter.jsx";

<TaskCounter done={counts.done} all={counts.all} />

データの流れ:
counts.done ──props──> done ──JSX──> <strong>
counts.all  ──props──> all  ──JSX──> <span>
*/

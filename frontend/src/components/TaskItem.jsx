export default function TaskItem({ task, onToggle, onDelete, disabled }) {
  return (
    <li className={task.done ? "task-item task-item--done" : "task-item"}>
      <button
        className="task-item__check"
        type="button"
        onClick={() => onToggle(task)}
        disabled={disabled}
        aria-label={task.done ? `${task.title}を未完了に戻す` : `${task.title}を完了にする`}
      >
        <span aria-hidden="true">{task.done ? "✓" : ""}</span>
      </button>

      <div className="task-item__body">
        <p>{task.title}</p>
        <span>task #{task.id}</span>
      </div>

      <button
        className="task-item__delete"
        type="button"
        onClick={() => onDelete(task.id)}
        disabled={disabled}
        aria-label={`${task.title}を削除する`}
      >
        削除
      </button>
    </li>
  );
}

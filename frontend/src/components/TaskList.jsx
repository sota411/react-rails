import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onDelete, disabled }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__illustration" aria-hidden="true">
          <span>✓</span><i /><i />
        </div>
        <h2>この棚はまだ空です</h2>
        <p>上の入力欄から1件追加すると、React → Rails → DBの旅が始まります。</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}

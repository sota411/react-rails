import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api/tasks.js";
import LearningTrace from "./components/LearningTrace.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { countTasks, filterTasks } from "./lib/taskFilters.js";

const filters = [
  { id: "all", label: "すべて" },
  { id: "active", label: "未完了" },
  { id: "done", label: "完了" },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [traceStage, setTraceStage] = useState("sending");
  const [traceAction, setTraceAction] = useState("最初の一覧を取得中");
  const [traceOpen, setTraceOpen] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setStatus("loading");
    setErrorMessage("");
    setTraceAction("一覧を読み込む GET /api/v1/tasks");

    try {
      const loadedTasks = await getTasks(setTraceStageWithServerWait);
      setTasks(loadedTasks);
      setTraceStage("state");
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }

  function setTraceStageWithServerWait(stage) {
    setTraceStage(stage);
    if (stage === "sending") {
      window.setTimeout(() => setTraceStage("server"), 180);
    }
  }

  async function handleAdd(title) {
    setStatus("saving");
    setErrorMessage("");
    setTraceStage("input");
    setTraceAction(`「${title}」を追加する POST /api/v1/tasks`);

    try {
      const newTask = await createTask(title, setTraceStageWithServerWait);
      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTraceStage("state");
      setStatus("ready");
      return true;
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return false;
    }
  }

  async function handleToggle(task) {
    setStatus("saving");
    setErrorMessage("");
    setTraceStage("input");
    setTraceAction(`task #${task.id} の完了状態を変える PATCH`);

    try {
      const changedTask = await updateTask(task, setTraceStageWithServerWait);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => {
          if (currentTask.id === changedTask.id) return changedTask;
          return currentTask;
        }),
      );
      setTraceStage("state");
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }

  async function handleDelete(taskId) {
    setStatus("saving");
    setErrorMessage("");
    setTraceStage("input");
    setTraceAction(`task #${taskId} を削除する DELETE`);

    try {
      await deleteTask(taskId, setTraceStageWithServerWait);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
      setTraceStage("state");
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }

  const counts = useMemo(() => countTasks(tasks), [tasks]);
  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const isBusy = status === "loading" || status === "saving";

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">REACT × RAILS PRACTICE</p>
          <h1>Task Bridge</h1>
          <p>画面の操作が、どのコードを通り、どこへ保存されるかを目で追う練習帳。</p>
        </div>
        <div className="hero__stamp" aria-label="現在の学習テーマ">
          <span>NOW LEARNING</span><strong>データの旅</strong>
        </div>
      </section>

      <LearningTrace
        currentStage={traceStage}
        action={traceAction}
        expanded={traceOpen}
        onToggle={() => setTraceOpen((open) => !open)}
      />

      <section className="workspace">
        <header className="workspace__header">
          <div><p className="eyebrow">TODAY'S TASKS</p><h2>今日の練習</h2></div>
          <div className="counter" aria-label="タスクの件数"><strong>{counts.done}</strong><span>/ {counts.all} 完了</span></div>
        </header>

        <TaskForm onAdd={handleAdd} disabled={isBusy} />

        {errorMessage && (
          <div className="error-card" role="alert">
            <strong>処理が途中で止まりました</strong>
            <p>{errorMessage}</p>
            <button type="button" onClick={loadTasks}>もう一度一覧を読む</button>
          </div>
        )}

        <nav className="filters" aria-label="タスクの絞り込み">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "filters__button filters__button--active" : "filters__button"}
              onClick={() => setFilter(item.id)}
            >
              {item.label}<span>{counts[item.id]}</span>
            </button>
          ))}
        </nav>

        {status === "loading" ? (
          <div className="loading-card"><span className="loading-card__dot" />Railsからタスクを受け取っています…</div>
        ) : (
          <TaskList tasks={visibleTasks} onToggle={handleToggle} onDelete={handleDelete} disabled={isBusy} />
        )}
      </section>

      <footer className="page-footer">
        <p><strong>観察ポイント:</strong> DevToolsのNetworkで <code>/api/v1/tasks</code> を探す</p>
        <p>Lesson 6で、この往復をコードとログから読み解きます。</p>
      </footer>
    </main>
  );
}

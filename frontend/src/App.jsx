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
  const [traceAction, setTraceAction] = useState("GET /api/v1/tasks を実行中");
  const [traceOpen, setTraceOpen] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setStatus("loading");
    setErrorMessage("");
    setTraceAction("GET /api/v1/tasks でtask一覧を取得");

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
      // 通信が180ms以上続いた場合だけ、教材上のserver段階を表示します。
      // これは実行計測ではなく、処理順を確認するための表示です。
      window.setTimeout(() => {
        setTraceStage((currentStage) => {
          return currentStage === "sending" ? "server" : currentStage;
        });
      }, 180);
    }
  }

  async function handleAdd(title) {
    setStatus("saving");
    setErrorMessage("");
    setTraceStage("input");
    setTraceAction(`POST /api/v1/tasks: title="${title}"`);

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
    setTraceAction(`PATCH /api/v1/tasks/${task.id}: done=${!task.done}`);

    try {
      const changedTask = await updateTask(task, setTraceStageWithServerWait);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => {
          if (currentTask.id === changedTask.id) {
            return changedTask;
          }
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
    setTraceAction(`DELETE /api/v1/tasks/${taskId}`);

    try {
      await deleteTask(taskId, setTraceStageWithServerWait);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
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
          <p>
            画面操作からHTTP request、Rails、DB保存、React state更新までを、
            実際のmethod・path・function名で追跡します。
          </p>
        </div>
        <div className="hero__stamp" aria-label="現在の学習テーマ">
          <span>NOW LEARNING</span>
          <strong>REQUEST FLOW</strong>
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
          <div>
            <p className="eyebrow">TASK DATA</p>
            <h2>task一覧</h2>
          </div>
          <div className="counter" aria-label="タスクの件数">
            <strong>{counts.done}</strong>
            <span>/ {counts.all} 完了</span>
          </div>
        </header>

        <TaskForm onAdd={handleAdd} disabled={isBusy} />

        {errorMessage && (
          <div className="error-card" role="alert">
            <strong>requestが成功しませんでした</strong>
            <p>{errorMessage}</p>
            <button type="button" onClick={loadTasks}>
              GET /api/v1/tasks を再実行
            </button>
          </div>
        )}

        <nav className="filters" aria-label="タスクの絞り込み">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                filter === item.id
                  ? "filters__button filters__button--active"
                  : "filters__button"
              }
              onClick={() => setFilter(item.id)}
            >
              {item.label}
              <span>{counts[item.id]}</span>
            </button>
          ))}
        </nav>

        {status === "loading" ? (
          <div className="loading-card">
            <span className="loading-card__dot" />
            GET /api/v1/tasks のresponseを待っています…
          </div>
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            disabled={isBusy}
          />
        )}
      </section>

      <footer className="page-footer">
        <p>
          <strong>確認場所:</strong> DevToolsのNetworkで <code>/api/v1/tasks</code> を選ぶ
        </p>
        <p>method、payload、status、responseを実行経路の表示と照合します。</p>
      </footer>
    </main>
  );
}

const stages = [
  {
    id: "input",
    title: "React event",
    detail: "TaskForm.handleSubmit → onAdd(title)",
  },
  {
    id: "sending",
    title: "HTTP request",
    detail: "POST /api/v1/tasks + JSON body",
  },
  {
    id: "server",
    title: "Rails + SQLite",
    detail: "Route → Controller → Task#save",
  },
  {
    id: "receiving",
    title: "HTTP response",
    detail: "201 Created + task JSON",
  },
  {
    id: "state",
    title: "React state",
    detail: "setTasks(...) → re-render",
  },
];

function stageIndex(stageId) {
  return stages.findIndex((stage) => stage.id === stageId);
}

export default function LearningTrace({ currentStage, action, expanded, onToggle }) {
  const currentIndex = stageIndex(currentStage);

  return (
    <aside className={expanded ? "trace trace--open" : "trace"} aria-label="実行経路">
      <button className="trace__toggle" type="button" onClick={onToggle}>
        <span>
          <strong>実行経路</strong>
          <small>{action || "操作すると、処理段階を表示します"}</small>
        </span>
        <span aria-hidden="true">{expanded ? "−" : "＋"}</span>
      </button>

      {expanded && (
        <div className="trace__body">
          <div className="trace__rail" aria-hidden="true" />
          {stages.map((stage, index) => {
            let state = "waiting";
            if (index < currentIndex) state = "passed";
            if (index === currentIndex) state = "current";

            return (
              <div className={`trace-step trace-step--${state}`} key={stage.id}>
                <div className="trace-step__icon" aria-hidden="true">
                  {index + 1}
                </div>
                <div>
                  <strong>{stage.title}</strong>
                  <span>{stage.detail}</span>
                </div>
              </div>
            );
          })}
          <p className="trace__note">
            これは教材が設定した段階表示です。正確なmethod、payload、status、実行時間は
            DevToolsのNetworkとRailsログで確認します。
          </p>
        </div>
      )}
    </aside>
  );
}

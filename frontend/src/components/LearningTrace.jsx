const stages = [
  { id: "input", icon: "☝", title: "React", detail: "操作を受け取る" },
  { id: "sending", icon: "→", title: "HTTP", detail: "リクエスト送信" },
  { id: "server", icon: "⚙", title: "Rails + DB", detail: "受付・保存" },
  { id: "receiving", icon: "←", title: "JSON", detail: "結果を受信" },
  { id: "state", icon: "◉", title: "state", detail: "画面を描き直す" },
];

function stageIndex(stageId) {
  return stages.findIndex((stage) => stage.id === stageId);
}

export default function LearningTrace({ currentStage, action, expanded, onToggle }) {
  const currentIndex = stageIndex(currentStage);

  return (
    <aside className={expanded ? "trace trace--open" : "trace"} aria-label="処理の現在地">
      <button className="trace__toggle" type="button" onClick={onToggle}>
        <span>
          <strong>処理のX線モード</strong>
          <small>{action || "操作すると、データの旅を表示します"}</small>
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
                <div className="trace-step__icon" aria-hidden="true">{stage.icon}</div>
                <div><strong>{stage.title}</strong><span>{stage.detail}</span></div>
              </div>
            );
          })}
          <p className="trace__note">
            Rails内部は一瞬で進むため、待機中は「Route → Controller → Model → DB」をまとめて表示します。
          </p>
        </div>
      )}
    </aside>
  );
}

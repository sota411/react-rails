import { useEffect, useMemo, useState } from "react";
import { courseCatalog, findCourse } from "./course/courseData.js";
import { evaluateCode } from "./course/checkers.js";

const PROGRESS_KEY = "react-rails-hands-on-progress-v1";
const CODE_KEY = "react-rails-hands-on-code-v1";

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function stepKey(courseId, stepId) {
  return `${courseId}:${stepId}`;
}

function bodyMatchesExpectation(body, expectation) {
  switch (expectation) {
    case "array":
      return Array.isArray(body);
    case "errors":
      return Array.isArray(body?.errors) && body.errors.length > 0;
    case "task":
      return Boolean(body && typeof body === "object" && body.id && body.title);
    case "any":
    default:
      return true;
  }
}

function formatBody(body) {
  if (body === null || body === undefined || body === "") return "（response bodyなし）";
  if (typeof body === "string") return body;
  return JSON.stringify(body, null, 2);
}

export default function App() {
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => readStorage(PROGRESS_KEY, {}));
  const [codeByStep, setCodeByStep] = useState(() => readStorage(CODE_KEY, {}));
  const [codeFeedback, setCodeFeedback] = useState(null);
  const [requestResult, setRequestResult] = useState(null);
  const [requestRunning, setRequestRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [homeNotice, setHomeNotice] = useState("");

  const activeCourse = activeCourseId ? findCourse(activeCourseId) : null;
  const activeStep = activeCourse?.steps[stepIndex] ?? null;
  const activeKey = activeCourse && activeStep ? stepKey(activeCourse.id, activeStep.id) : "";
  const stepPassed = Boolean(activeKey && completedSteps[activeKey]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    window.localStorage.setItem(CODE_KEY, JSON.stringify(codeByStep));
  }, [codeByStep]);

  useEffect(() => {
    setCodeFeedback(null);
    setRequestResult(null);
    setRequestRunning(false);
    setSelectedAnswer(null);
    setQuizFeedback(null);
  }, [activeKey]);

  function courseCompletion(course) {
    const completed = course.steps.filter((step) => completedSteps[stepKey(course.id, step.id)]).length;
    return { completed, total: course.steps.length };
  }

  function startCourse(courseId) {
    const course = findCourse(courseId);
    const firstIncomplete = course.steps.findIndex(
      (step) => !completedSteps[stepKey(course.id, step.id)],
    );

    setActiveCourseId(course.id);
    setStepIndex(firstIncomplete === -1 ? 0 : firstIncomplete);
    setHomeNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openStep(nextIndex) {
    setStepIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markCurrentStepComplete() {
    if (!activeKey) return;
    setCompletedSteps((current) => ({ ...current, [activeKey]: true }));
  }

  function goNext() {
    if (!activeCourse) return;

    if (stepIndex < activeCourse.steps.length - 1) {
      openStep(stepIndex + 1);
      return;
    }

    setHomeNotice(`「${activeCourse.title}」を完了しました。次に進む内容は自分で選べます。`);
    setActiveCourseId(null);
    setStepIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    setActiveCourseId(null);
    setStepIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function currentCode() {
    if (!activeStep || activeStep.type !== "edit") return "";
    return codeByStep[activeKey] ?? activeStep.starterCode;
  }

  function updateCurrentCode(value) {
    setCodeByStep((current) => ({ ...current, [activeKey]: value }));
    setCodeFeedback(null);
  }

  function resetCurrentCode() {
    if (!activeStep || activeStep.type !== "edit") return;
    setCodeByStep((current) => ({ ...current, [activeKey]: activeStep.starterCode }));
    setCodeFeedback(null);
  }

  function checkCurrentCode() {
    if (!activeStep || activeStep.type !== "edit") return;
    const feedback = evaluateCode(activeStep.checker, currentCode());
    setCodeFeedback(feedback);
    if (feedback.passed) markCurrentStepComplete();
  }

  async function runCurrentRequest() {
    if (!activeStep || activeStep.type !== "request") return;

    setRequestRunning(true);
    setRequestResult(null);
    const startedAt = performance.now();
    const { method, path, body, expectedStatus, expectBody } = activeStep.request;

    try {
      const options = {
        method,
        headers: { Accept: "application/json" },
      };

      if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }

      const response = await fetch(path, options);
      const raw = await response.text();
      let parsedBody = raw;

      if (raw) {
        try {
          parsedBody = JSON.parse(raw);
        } catch {
          parsedBody = raw;
        }
      } else {
        parsedBody = null;
      }

      const statusMatches = response.status === expectedStatus;
      const responseMatches = bodyMatchesExpectation(parsedBody, expectBody);
      const passed = statusMatches && responseMatches;

      setRequestResult({
        passed,
        method,
        path,
        requestBody: body ?? null,
        status: response.status,
        statusText: response.statusText,
        responseBody: parsedBody,
        duration: Math.round(performance.now() - startedAt),
        expectedStatus,
        statusMatches,
        responseMatches,
      });

      if (passed) markCurrentStepComplete();
    } catch (error) {
      setRequestResult({
        passed: false,
        method,
        path,
        requestBody: body ?? null,
        networkError: error.message,
        duration: Math.round(performance.now() - startedAt),
      });
    } finally {
      setRequestRunning(false);
    }
  }

  function submitQuiz() {
    if (!activeStep || activeStep.type !== "quiz" || selectedAnswer === null) return;
    const correct = selectedAnswer === activeStep.answer;
    setQuizFeedback({ correct, explanation: activeStep.explanation });
    if (correct) markCurrentStepComplete();
  }

  function resetAllProgress() {
    const confirmed = window.confirm("すべての進捗とsandbox codeを初期状態へ戻しますか？");
    if (!confirmed) return;
    setCompletedSteps({});
    setCodeByStep({});
    setHomeNotice("進捗を初期化しました。");
  }

  if (!activeCourse || !activeStep) {
    return (
      <CourseHome
        completedSteps={completedSteps}
        courseCompletion={courseCompletion}
        notice={homeNotice}
        onStart={startCourse}
        onReset={resetAllProgress}
      />
    );
  }

  return (
    <LessonView
      course={activeCourse}
      step={activeStep}
      stepIndex={stepIndex}
      completedSteps={completedSteps}
      passed={stepPassed}
      code={currentCode()}
      codeFeedback={codeFeedback}
      requestResult={requestResult}
      requestRunning={requestRunning}
      selectedAnswer={selectedAnswer}
      quizFeedback={quizFeedback}
      onHome={goHome}
      onOpenStep={openStep}
      onCodeChange={updateCurrentCode}
      onCodeReset={resetCurrentCode}
      onCodeCheck={checkCurrentCode}
      onRunRequest={runCurrentRequest}
      onSelectAnswer={setSelectedAnswer}
      onSubmitQuiz={submitQuiz}
      onReadComplete={markCurrentStepComplete}
      onNext={goNext}
    />
  );
}

function CourseHome({ completedSteps, courseCompletion, notice, onStart, onReset }) {
  const totalSteps = courseCatalog.reduce((sum, course) => sum + course.steps.length, 0);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  return (
    <main className="course-home">
      <header className="home-header">
        <div className="brand-mark" aria-hidden="true">R/R</div>
        <div className="brand-copy">
          <strong>React × Rails Hands-on</strong>
          <span>browser only / no Codex wait</span>
        </div>
        <button className="text-button" type="button" onClick={onReset}>
          進捗を初期化
        </button>
      </header>

      <section className="home-hero">
        <p className="section-label">START HERE</p>
        <h1>1 Stepずつ、書いて、実行して、確認する。</h1>
        <p className="home-lead">
          起動後に使うのはこの画面だけです。学ぶ順番は固定していません。
          下から1本選び、各Stepに表示される「今やること」だけを進めます。
        </p>

        <div className="next-action-card">
          <span className="next-action-card__number">1</span>
          <div>
            <small>今やること</small>
            <strong>下のカードから学びたい内容を1つ選び、「始める」を押す</strong>
          </div>
        </div>

        <div className="overall-progress" aria-label={`全体進捗 ${progressPercent}%`}>
          <div>
            <span>全体進捗</span>
            <strong>{completedCount} / {totalSteps} Steps</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <b>{progressPercent}%</b>
        </div>

        {notice && <div className="home-notice" role="status">{notice}</div>}
      </section>

      <section className="course-picker" aria-labelledby="course-picker-title">
        <div className="section-heading">
          <div>
            <p className="section-label">CHOOSE A HANDS-ON</p>
            <h2 id="course-picker-title">どこから始めても構いません</h2>
          </div>
          <p>各カードに、実際に書くものと完了後にできることを明記しています。</p>
        </div>

        <div className="course-grid">
          {courseCatalog.map((course) => {
            const progress = courseCompletion(course);
            const finished = progress.completed === progress.total;
            return (
              <article className={`course-card course-card--${course.accent}`} key={course.id}>
                <div className="course-card__topline">
                  <span className="course-number">{course.number}</span>
                  <span className="course-category">{course.category}</span>
                  {finished && <span className="done-badge">完了</span>}
                </div>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <dl className="course-meta">
                  <div><dt>書くもの</dt><dd>{course.writes}</dd></div>
                  <div><dt>目安</dt><dd>{course.duration}</dd></div>
                  <div><dt>完了後</dt><dd>{course.outcome}</dd></div>
                </dl>
                <div className="course-card__progress">
                  <span>{progress.completed} / {progress.total} Steps</span>
                  <div><i style={{ width: `${(progress.completed / progress.total) * 100}%` }} /></div>
                </div>
                <button type="button" onClick={() => onStart(course.id)}>
                  {progress.completed > 0 && !finished ? "続きから" : finished ? "もう一度見る" : "このハンズオンを始める"}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function LessonView({
  course,
  step,
  stepIndex,
  completedSteps,
  passed,
  code,
  codeFeedback,
  requestResult,
  requestRunning,
  selectedAnswer,
  quizFeedback,
  onHome,
  onOpenStep,
  onCodeChange,
  onCodeReset,
  onCodeCheck,
  onRunRequest,
  onSelectAnswer,
  onSubmitQuiz,
  onReadComplete,
  onNext,
}) {
  const progress = course.steps.filter((item) => completedSteps[stepKey(course.id, item.id)]).length;
  const percent = Math.round((progress / course.steps.length) * 100);
  const isLast = stepIndex === course.steps.length - 1;

  return (
    <main className={`lesson-page lesson-page--${course.accent}`}>
      <header className="lesson-header">
        <button className="back-button" type="button" onClick={onHome}>← コース一覧</button>
        <div className="lesson-header__title">
          <span>{course.number} / {course.category}</span>
          <strong>{course.title}</strong>
        </div>
        <div className="lesson-header__progress">
          <span>{progress} / {course.steps.length} Steps</span>
          <div><i style={{ width: `${percent}%` }} /></div>
        </div>
      </header>

      <div className="lesson-layout">
        <aside className="step-rail" aria-label="ハンズオンのStep">
          <div className="step-rail__intro">
            <small>現在地</small>
            <strong>Step {stepIndex + 1} / {course.steps.length}</strong>
          </div>
          <ol>
            {course.steps.map((item, index) => {
              const itemDone = Boolean(completedSteps[stepKey(course.id, item.id)]);
              const current = index === stepIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={current ? "step-link step-link--current" : "step-link"}
                    onClick={() => onOpenStep(index)}
                    aria-current={current ? "step" : undefined}
                  >
                    <span className="step-link__marker">{itemDone ? "✓" : index + 1}</span>
                    <span><small>{item.type === "edit" ? "CODE" : item.type === "request" ? "RUN" : item.type === "quiz" ? "CHECK" : "READ"}</small><strong>{item.title}</strong></span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="step-rail__rule">
            <strong>進め方</strong>
            <p>この画面に書かれた作業だけを行います。別の資料やCodexを開く必要はありません。</p>
          </div>
        </aside>

        <section className="step-workspace">
          <div className="step-heading">
            <div>
              <p className="section-label">STEP {String(stepIndex + 1).padStart(2, "0")}</p>
              <h1>{step.title}</h1>
            </div>
            <span className={`step-type step-type--${step.type}`}>
              {step.type === "edit" ? "コードを書く" : step.type === "request" ? "実行する" : step.type === "quiz" ? "理解を確認" : "仕組みを見る"}
            </span>
          </div>

          <section className="task-brief" aria-labelledby="current-task-title">
            <div className="task-brief__label"><span>NOW</span><strong id="current-task-title">今やること</strong></div>
            <div className="task-brief__body">
              <h2>{step.goal}</h2>
              <ol>
                {step.instructions?.map((instruction) => <li key={instruction}>{instruction}</li>)}
              </ol>
              <div className="completion-rule">
                <span>完了条件</span>
                <strong>{step.completion}</strong>
              </div>
            </div>
          </section>

          <ConceptPreview kind={step.preview} passed={passed} />

          <StepActivity
            step={step}
            passed={passed}
            isLast={isLast}
            code={code}
            codeFeedback={codeFeedback}
            requestResult={requestResult}
            requestRunning={requestRunning}
            selectedAnswer={selectedAnswer}
            quizFeedback={quizFeedback}
            onCodeChange={onCodeChange}
            onCodeReset={onCodeReset}
            onCodeCheck={onCodeCheck}
            onRunRequest={onRunRequest}
            onSelectAnswer={onSelectAnswer}
            onSubmitQuiz={onSubmitQuiz}
            onReadComplete={onReadComplete}
            onNext={onNext}
          />

          {step.terms && <TermList terms={step.terms} />}
          {step.explanation && (
            <details className="technical-note">
              <summary>技術的な補足を読む</summary>
              <p>{step.explanation}</p>
            </details>
          )}
        </section>
      </div>
    </main>
  );
}

function StepActivity({
  step,
  passed,
  isLast,
  code,
  codeFeedback,
  requestResult,
  requestRunning,
  selectedAnswer,
  quizFeedback,
  onCodeChange,
  onCodeReset,
  onCodeCheck,
  onRunRequest,
  onSelectAnswer,
  onSubmitQuiz,
  onReadComplete,
  onNext,
}) {
  return (
    <section className="activity-card">
      {step.type === "read" && (
        <>
          {step.code && <CodeBlock title="実際に対応するコード" code={step.code} />}
          {!passed && (
            <div className="activity-action">
              <p>上のコードと表示を確認したら、このStepを完了にします。</p>
              <button className="primary-button" type="button" onClick={onReadComplete}>確認して完了</button>
            </div>
          )}
        </>
      )}

      {step.type === "edit" && (
        <>
          <div className="editor-shell">
            <div className="editor-toolbar">
              <div><span className="editor-dot" /><strong>{step.targetFile}</strong></div>
              <button type="button" onClick={onCodeReset}>初期状態へ戻す</button>
            </div>
            <textarea
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              spellCheck="false"
              aria-label={`${step.targetFile}のsandbox editor`}
            />
          </div>
          <p className="sandbox-note">
            これは教材内のsandboxです。「コードを確認」は必要な構文とdata flowを決定的なruleで検査し、LLMは使用しません。
          </p>
          {codeFeedback && <CheckFeedback feedback={codeFeedback} />}
          {!passed && (
            <div className="activity-action">
              <p>一度に直すのは、上の「今やること」に書かれた箇所だけです。</p>
              <button className="primary-button" type="button" onClick={onCodeCheck}>コードを確認</button>
            </div>
          )}
        </>
      )}

      {step.type === "request" && (
        <>
          <RequestSpec request={step.request} />
          {requestResult && <RequestResult result={requestResult} />}
          {!passed && (
            <div className="activity-action">
              <p>実際のlocalhost上のRails APIへrequestを送ります。</p>
              <button className="primary-button" type="button" onClick={onRunRequest} disabled={requestRunning}>
                {requestRunning ? "実行中…" : step.primaryLabel}
              </button>
            </div>
          )}
        </>
      )}

      {step.type === "quiz" && (
        <>
          <fieldset className="quiz-panel">
            <legend>{step.question}</legend>
            {step.choices.map((choice, index) => (
              <label className={selectedAnswer === index ? "quiz-choice quiz-choice--selected" : "quiz-choice"} key={choice}>
                <input
                  type="radio"
                  name={step.id}
                  checked={selectedAnswer === index}
                  onChange={() => onSelectAnswer(index)}
                />
                <span className="quiz-choice__letter">{String.fromCharCode(65 + index)}</span>
                <span>{choice}</span>
              </label>
            ))}
          </fieldset>
          {quizFeedback && (
            <div className={quizFeedback.correct ? "quiz-feedback quiz-feedback--success" : "quiz-feedback quiz-feedback--error"} role="status">
              <strong>{quizFeedback.correct ? "正解です" : "まだ違います"}</strong>
              <p>{quizFeedback.explanation}</p>
            </div>
          )}
          {!passed && (
            <div className="activity-action">
              <p>暗記ではなく、直前に見た実行結果を根拠に選びます。</p>
              <button className="primary-button" type="button" onClick={onSubmitQuiz} disabled={selectedAnswer === null}>回答を確認</button>
            </div>
          )}
        </>
      )}

      {passed && (
        <div className="passed-panel" role="status">
          <div><span>✓</span><div><small>STEP COMPLETE</small><strong>完了条件を満たしました</strong></div></div>
          <button className="primary-button" type="button" onClick={onNext}>
            {isLast ? "ハンズオンを完了" : "次のStepへ"} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}

function CodeBlock({ title, code }) {
  return (
    <div className="code-block">
      <div className="code-block__title">{title}</div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function CheckFeedback({ feedback }) {
  return (
    <div className={feedback.passed ? "check-feedback check-feedback--success" : "check-feedback"} role="status">
      <div className="check-feedback__heading">
        <strong>{feedback.passed ? "すべての条件を満たしました" : "未完了の条件があります"}</strong>
        <span>{feedback.checks.filter((check) => check.passed).length} / {feedback.checks.length}</span>
      </div>
      <ul>
        {feedback.checks.map((check) => (
          <li className={check.passed ? "check-item check-item--passed" : "check-item"} key={check.label}>
            <span>{check.passed ? "✓" : "○"}</span>
            <div><strong>{check.label}</strong>{!check.passed && <p>{check.hint}</p>}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestSpec({ request }) {
  return (
    <div className="request-spec">
      <div className="request-spec__heading"><span>これから送るrequest</span><strong>{request.method} {request.path}</strong></div>
      <div className="request-spec__grid">
        <div><small>METHOD</small><code>{request.method}</code></div>
        <div><small>PATH</small><code>{request.path}</code></div>
        <div className="request-spec__body"><small>BODY</small><pre>{formatBody(request.body ?? null)}</pre></div>
        <div><small>EXPECTED</small><code>{request.expectedStatus}</code></div>
      </div>
    </div>
  );
}

function RequestResult({ result }) {
  if (result.networkError) {
    return (
      <div className="request-result request-result--error" role="status">
        <strong>Network error</strong>
        <p>{result.networkError}</p>
      </div>
    );
  }

  return (
    <div className={result.passed ? "request-result request-result--success" : "request-result request-result--error"} role="status">
      <div className="request-result__summary">
        <div><small>REQUEST</small><strong>{result.method} {result.path}</strong></div>
        <div><small>STATUS</small><strong>{result.status} {result.statusText}</strong></div>
        <div><small>TIME</small><strong>{result.duration} ms</strong></div>
      </div>
      <div className="request-result__bodies">
        <div><small>REQUEST BODY</small><pre>{formatBody(result.requestBody)}</pre></div>
        <div><small>RESPONSE BODY</small><pre>{formatBody(result.responseBody)}</pre></div>
      </div>
      <div className="request-result__checks">
        <span>{result.statusMatches ? "✓" : "×"} expected status: {result.expectedStatus}</span>
        <span>{result.responseMatches ? "✓" : "×"} response bodyの形</span>
      </div>
    </div>
  );
}

function TermList({ terms }) {
  return (
    <section className="term-list" aria-label="このStepで使う用語">
      <h2>このStepで使う用語</h2>
      <dl>
        {terms.map(([term, definition]) => (
          <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>
        ))}
      </dl>
    </section>
  );
}

function ConceptPreview({ kind, passed }) {
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    setDemoOpen(false);
  }, [kind]);

  if (!kind) return null;

  if (kind === "props" || kind === "props-result") {
    return (
      <section className="concept-preview concept-preview--props" aria-label="propsの受け渡し">
        <div className="component-card">
          <small>PARENT COMPONENT</small>
          <code>&lt;TaskCount done=&#123;2&#125; total=&#123;3&#125; /&gt;</code>
        </div>
        <div className="value-transfer" aria-hidden="true"><span>done: 2</span><span>total: 3</span><i>→</i></div>
        <div className="component-card">
          <small>CHILD COMPONENT</small>
          <code>TaskCount(&#123; done, total &#125;)</code>
        </div>
        <div className="rendered-card"><small>RENDERED UI</small><strong>{kind === "props-result" && !passed ? "完了: 0 / 0" : "完了: 2 / 3"}</strong></div>
      </section>
    );
  }

  if (kind === "state" || kind === "state-result") {
    return (
      <section className="concept-preview state-demo" aria-label="stateの変更前後">
        <div className="state-register"><small>CURRENT STATE</small><strong>open = {String(demoOpen)}</strong></div>
        <div className="state-screen">
          <button type="button" onClick={() => setDemoOpen((current) => !current)}>説明を切り替える</button>
          <div className={demoOpen ? "state-screen__result state-screen__result--visible" : "state-screen__result"}>
            {demoOpen ? "stateがtrueなので表示されています" : "openがfalseなので説明文は描画されません"}
          </div>
        </div>
        <div className="state-sequence"><span>click event</span><i>→</i><span>setOpen</span><i>→</i><span>re-render</span></div>
      </section>
    );
  }

  if (kind.includes("route") || kind === "controller") {
    return (
      <section className="concept-preview route-preview" aria-label="Rails requestの実行経路">
        <div><small>HTTP REQUEST</small><strong>GET /api/v1/stats</strong></div>
        <span aria-hidden="true">→</span>
        <div><small>config/routes.rb</small><strong>stats#show</strong></div>
        <span aria-hidden="true">→</span>
        <div><small>CONTROLLER</small><strong>StatsController#show</strong></div>
        <span aria-hidden="true">→</span>
        <div><small>HTTP RESPONSE</small><strong>200 + JSON</strong></div>
      </section>
    );
  }

  if (kind.includes("validation")) {
    return (
      <section className="concept-preview validation-preview" aria-label="validation failureの流れ">
        <div className="validation-input"><small>task.title</small><strong>""</strong></div>
        <div className="validation-rule"><small>MODEL RULE</small><code>presence: true</code><span>条件を満たさない</span></div>
        <div className="validation-response"><small>RESPONSE</small><strong>422</strong><code>&#123; errors: [...] &#125;</code></div>
      </section>
    );
  }

  if (kind === "fullstack" || kind === "fetch" || kind === "post-request") {
    const stages = ["handleSubmit", "handleAdd", "POST", "create", "INSERT", "201", "setTasks"];
    return (
      <section className="concept-preview fullstack-preview" aria-label="POST作成処理の流れ">
        {stages.map((stage, index) => (
          <div className="fullstack-stage" key={stage}><span>{index + 1}</span><strong>{stage}</strong></div>
        ))}
      </section>
    );
  }

  if (kind.includes("debug")) {
    const is404 = kind.includes("404");
    return (
      <section className="concept-preview debug-preview" aria-label="debug evidence">
        <div className="debug-evidence"><small>REQUEST</small><strong>{is404 ? "GET /api/v1/taskz" : "POST /api/v1/tasks"}</strong></div>
        <div className="debug-status"><small>STATUS</small><strong>{is404 ? "404" : "422"}</strong></div>
        <div className="debug-next"><small>NEXT CHECK</small><strong>{is404 ? "Routeのmethod / path" : "request body / Model errors"}</strong></div>
      </section>
    );
  }

  return (
    <section className="concept-preview request-preview" aria-label="HTTP requestとresponse">
      <div><small>BROWSER</small><strong>fetch()</strong></div>
      <span aria-hidden="true">→</span>
      <div><small>REQUEST</small><strong>method + path + body</strong></div>
      <span aria-hidden="true">→</span>
      <div><small>RAILS</small><strong>Route → Controller → Model</strong></div>
      <span aria-hidden="true">→</span>
      <div><small>RESPONSE</small><strong>status + body</strong></div>
    </section>
  );
}

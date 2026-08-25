const TASKS_PATH = "/api/v1/tasks";

/** Railsから失敗が返ったとき、画面で扱いやすいErrorへ変換します。 */
async function readJson(response) {
  const contentType = response.headers.get("content-type") || "";
  const hasJsonBody = contentType.includes("application/json");
  const body = hasJsonBody ? await response.json() : null;

  if (response.ok) {
    return body;
  }

  const railsMessages = body?.errors;
  const message = Array.isArray(railsMessages)
    ? railsMessages.join(" / ")
    : `通信に失敗しました（結果番号: ${response.status}）`;

  const error = new Error(message);
  error.status = response.status;
  throw error;
}

export async function getTasks(reportStage = () => {}) {
  reportStage("sending");
  const response = await fetch(TASKS_PATH, {
    headers: { Accept: "application/json" },
  });
  reportStage("receiving");
  return readJson(response);
}

export async function createTask(title, reportStage = () => {}) {
  reportStage("sending");
  const response = await fetch(TASKS_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ task: { title } }),
  });
  reportStage("receiving");
  return readJson(response);
}

export async function updateTask(task, reportStage = () => {}) {
  reportStage("sending");
  const response = await fetch(`${TASKS_PATH}/${task.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ task: { done: !task.done } }),
  });
  reportStage("receiving");
  return readJson(response);
}

export async function deleteTask(taskId, reportStage = () => {}) {
  reportStage("sending");
  const response = await fetch(`${TASKS_PATH}/${taskId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  reportStage("receiving");

  if (!response.ok) {
    const error = new Error(`削除に失敗しました（結果番号: ${response.status}）`);
    error.status = response.status;
    throw error;
  }
}

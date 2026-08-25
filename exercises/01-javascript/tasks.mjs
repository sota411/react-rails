// Lesson 1の演習です。
// 1つのTODOを直すたびに、次を実行してください。
// node --test exercises/01-javascript/tasks.test.mjs

/**
 * task objectの配列から、titleだけの配列を返します。
 *
 * 入力例:
 * [{ title: "Reactを開く" }, { title: "Networkを見る" }]
 *
 * 出力例:
 * ["Reactを開く", "Networkを見る"]
 */
export function taskTitles(tasks) {
  // TODO 1:
  // tasksの各要素をtitleへ変換してください。
  throw new Error("TODO 1: taskTitlesを実装してください");
}

/**
 * 未完了（doneがfalse）のtaskだけを返します。
 */
export function activeTasks(tasks) {
  // TODO 2:
  // 条件に合う要素だけを残してください。
  throw new Error("TODO 2: activeTasksを実装してください");
}

/**
 * 新しいtaskを配列の先頭へ追加して返します。
 * 元のtasks配列は変更しません。
 */
export function addTask(tasks, title) {
  // TODO 3:
  // 1. newTaskを作る
  // 2. newTaskと元のtasksから、新しい配列を作る
  throw new Error("TODO 3: addTaskを実装してください");
}

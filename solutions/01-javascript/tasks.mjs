export function taskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function activeTasks(tasks) {
  return tasks.filter((task) => task.done === false);
}

export function addTask(tasks, title) {
  const newTask = {
    id: tasks.length + 1,
    title,
    done: false,
  };

  return [newTask, ...tasks];
}

/*
読み方:

1. taskTitles
   受け取る: task objectの配列
   行う: 各taskをtitleへ変換
   返す: titleの配列

2. activeTasks
   受け取る: task objectの配列
   行う: doneがfalseだけ残す
   返す: 未完了taskの配列

3. addTask
   受け取る: 現在の配列と新しいtitle
   行う: newTaskを作り、先頭へ並べる
   返す: 元のtasksとは別の新しい配列
*/

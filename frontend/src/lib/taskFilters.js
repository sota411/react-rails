export function filterTasks(tasks, filter) {
  if (filter === "active") {
    return tasks.filter((task) => !task.done);
  }

  if (filter === "done") {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

export function countTasks(tasks) {
  const done = tasks.filter((task) => task.done).length;

  return {
    all: tasks.length,
    active: tasks.length - done,
    done,
  };
}

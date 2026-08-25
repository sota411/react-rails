# priority機能の解答例

これは1つの実装例です。先に `exercises/07-priority/design.md` を埋め、自分の実装をtestしてから比較してください。

## 1. migration

```ruby
class AddPriorityToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :priority, :string,
               null: false,
               default: "normal"
  end
end
```

### 受け取る・行う・返す

```text
受け取る: 現在のtasks表
行う: priority列を追加
返す: 全recordがpriorityを持つDB構造
```

既存recordにもdefaultの `normal` が入ります。

## 2. Model

```ruby
class Task < ApplicationRecord
  PRIORITIES = %w[low normal high].freeze

  validates :title, presence: true, length: { maximum: 100 }
  validates :priority, inclusion: { in: PRIORITIES }
end
```

`urgent` のような未定義値は保存できません。

## 3. Controller

```ruby
def task_params
  params.require(:task).permit(:title, :done, :priority)
end
```

ここへ追加しないと、NetworkのPayloadにpriorityがあってもRailsが保存用の値から外します。

## 4. Model test

```ruby
test "known priority is valid" do
  task = Task.new(title: "重要", priority: "high")

  assert task.valid?
end

test "unknown priority is invalid" do
  task = Task.new(title: "重要", priority: "urgent")

  assert_not task.valid?
  assert task.errors[:priority].any?
end
```

## 5. Controller test

```ruby
test "creates a high priority task" do
  assert_difference("Task.count", 1) do
    post "/api/v1/tasks",
         params: { task: { title: "重要", priority: "high" } },
         as: :json
  end

  assert_response :created
  assert_equal "high", response.parsed_body["priority"]
  assert_equal "high", Task.order(:created_at).last.priority
end

test "rejects an unknown priority" do
  assert_no_difference("Task.count") do
    post "/api/v1/tasks",
         params: { task: { title: "重要", priority: "urgent" } },
         as: :json
  end

  assert_response :unprocessable_entity
end
```

## 6. API client

```js
export async function createTask(title, priority, reportStage = () => {}) {
  reportStage("sending");

  const response = await fetch(TASKS_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      task: { title, priority },
    }),
  });

  reportStage("receiving");
  return readJson(response);
}
```

## 7. TaskForm

追加するstate:

```jsx
const [priority, setPriority] = useState("normal");
```

select:

```jsx
<label htmlFor="task-priority">優先度</label>
<select
  id="task-priority"
  value={priority}
  onChange={(event) => setPriority(event.target.value)}
>
  <option value="low">低</option>
  <option value="normal">通常</option>
  <option value="high">高</option>
</select>
```

submit:

```jsx
const added = await onAdd(trimmedTitle, priority);
```

## 8. App

```jsx
async function handleAdd(title, priority) {
  // statusなどの既存処理はそのまま
  const newTask = await createTask(
    title,
    priority,
    setTraceStageWithServerWait,
  );

  setTasks((currentTasks) => [newTask, ...currentTasks]);
  return true;
}
```

## 9. TaskItem

```jsx
const priorityLabels = {
  low: "低",
  normal: "通常",
  high: "高",
};

<span className={`priority priority--${task.priority}`}>
  {priorityLabels[task.priority]}
</span>
```

色だけに頼らず、日本語ラベルも表示します。

## 10. 一本の確認

```text
selectでhigh
  ↓ TaskFormのpriority state
handleAdd(title, "high")
  ↓ createTask
POST JSONにpriority: "high"
  ↓ Controller permit
Task Model validation
  ↓ DB priority列
201 JSONにpriority: "high"
  ↓ setTasks
TaskItemに「高」
```

最後にページを再読み込みし、GET responseにもhighがあり、画面に再表示されることを確認してください。

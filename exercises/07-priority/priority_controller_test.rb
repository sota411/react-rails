require "test_helper"

class TaskPriorityRequestTest < ActionDispatch::IntegrationTest
  test "creates a high priority task" do
    # TODO:
    # 1. priority: highを含むPOST
    # 2. status 201
    # 3. response JSONのpriority
    # 4. DBへ保存されたpriority
  end

  test "rejects an unknown priority" do
    # TODO:
    # 1. priority: urgentを含むPOST
    # 2. status 422
    # 3. Task.countが増えていない
  end
end

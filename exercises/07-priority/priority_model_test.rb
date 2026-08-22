require "test_helper"

class TaskPriorityTest < ActiveSupport::TestCase
  test "normal priority is valid" do
    # TODO: normalを持つTaskがvalidであることを確認
  end

  test "unknown priority is invalid" do
    # TODO: urgentを持つTaskがinvalidであることを確認
    # TODO: priorityのerrorsがあることを確認
  end
end

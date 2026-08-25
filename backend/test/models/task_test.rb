require "test_helper"

class TaskTest < ActiveSupport::TestCase
  test "title is required" do
    task = Task.new(title: "")

    assert_not task.valid?
    assert task.errors[:title].any?
  end

  test "title can be at most 100 characters" do
    task = Task.new(title: "a" * 101)

    assert_not task.valid?
    assert task.errors[:title].any?
  end
end

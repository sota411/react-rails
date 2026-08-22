require "test_helper"

class Api::V1::TasksControllerTest < ActionDispatch::IntegrationTest
  test "lists tasks" do
    get "/api/v1/tasks"

    assert_response :success
    assert_kind_of Array, response.parsed_body
  end

  test "creates a task" do
    assert_difference("Task.count", 1) do
      post "/api/v1/tasks", params: { task: { title: "propsを説明する" } }, as: :json
    end

    assert_response :created
    assert_equal "propsを説明する", response.parsed_body["title"]
    assert_equal false, response.parsed_body["done"]
  end

  test "returns 422 for a blank title" do
    assert_no_difference("Task.count") do
      post "/api/v1/tasks", params: { task: { title: "" } }, as: :json
    end

    assert_response :unprocessable_entity
    assert response.parsed_body["errors"].any?
  end

  test "updates a task" do
    task = tasks(:open_task)
    patch "/api/v1/tasks/#{task.id}", params: { task: { done: true } }, as: :json

    assert_response :success
    assert_equal true, response.parsed_body["done"]
  end

  test "deletes a task" do
    task = tasks(:open_task)

    assert_difference("Task.count", -1) do
      delete "/api/v1/tasks/#{task.id}"
    end

    assert_response :no_content
  end
end

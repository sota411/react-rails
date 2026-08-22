require "test_helper"

class Api::V1::StatsControllerTest < ActionDispatch::IntegrationTest
  test "returns task counts" do
    get "/api/v1/stats"

    assert_response :success

    body = response.parsed_body
    assert_equal Task.count, body["all"]
    assert_equal Task.where(done: true).count, body["done"]
    assert_equal Task.where(done: false).count, body["active"]
  end
end

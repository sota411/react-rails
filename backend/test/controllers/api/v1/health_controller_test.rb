require "test_helper"

class Api::V1::HealthControllerTest < ActionDispatch::IntegrationTest
  test "returns API health" do
    get "/api/v1/health"

    assert_response :success
    assert_equal "ok", response.parsed_body["status"]
  end
end

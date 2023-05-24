require "test_helper"

class WaypointsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @waypoint = waypoints(:one)
  end

  test "should get index" do
    get waypoints_url, as: :json
    assert_response :success
  end

  test "should create waypoint" do
    assert_difference("Waypoint.count") do
      post waypoints_url, params: { waypoint: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show waypoint" do
    get waypoint_url(@waypoint), as: :json
    assert_response :success
  end

  test "should update waypoint" do
    patch waypoint_url(@waypoint), params: { waypoint: {  } }, as: :json
    assert_response :success
  end

  test "should destroy waypoint" do
    assert_difference("Waypoint.count", -1) do
      delete waypoint_url(@waypoint), as: :json
    end

    assert_response :no_content
  end
end

require "test_helper"

class GpxLogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @gpx_log = gpx_logs(:one)
  end

  test "should get index" do
    get gpx_logs_url, as: :json
    assert_response :success
  end

  test "should create gpx_log" do
    assert_difference("GpxLog.count") do
      post gpx_logs_url, params: { gpx_log: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show gpx_log" do
    get gpx_log_url(@gpx_log), as: :json
    assert_response :success
  end

  test "should update gpx_log" do
    patch gpx_log_url(@gpx_log), params: { gpx_log: {  } }, as: :json
    assert_response :success
  end

  test "should destroy gpx_log" do
    assert_difference("GpxLog.count", -1) do
      delete gpx_log_url(@gpx_log), as: :json
    end

    assert_response :no_content
  end
end

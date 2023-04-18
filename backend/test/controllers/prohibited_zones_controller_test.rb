require "test_helper"

class ProhibitedZonesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @prohibited_zone = prohibited_zones(:one)
  end

  test "should get index" do
    get prohibited_zones_url, as: :json
    assert_response :success
  end

  test "should create prohibited_zone" do
    assert_difference("ProhibitedZone.count") do
      post prohibited_zones_url, params: { prohibited_zone: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show prohibited_zone" do
    get prohibited_zone_url(@prohibited_zone), as: :json
    assert_response :success
  end

  test "should update prohibited_zone" do
    patch prohibited_zone_url(@prohibited_zone), params: { prohibited_zone: {  } }, as: :json
    assert_response :success
  end

  test "should destroy prohibited_zone" do
    assert_difference("ProhibitedZone.count", -1) do
      delete prohibited_zone_url(@prohibited_zone), as: :json
    end

    assert_response :no_content
  end
end

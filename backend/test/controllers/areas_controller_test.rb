require "test_helper"

class AreasControllerTest < ActionDispatch::IntegrationTest
  setup do
    @area = areas(:one)
  end

  test "should get index" do
    get areas_url, as: :json
    assert_response :success
  end

  test "should create area" do
    assert_difference("Area.count") do
      post areas_url, params: { area: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show area" do
    get area_url(@area), as: :json
    assert_response :success
  end

  test "should update area" do
    patch area_url(@area), params: { area: {  } }, as: :json
    assert_response :success
  end

  test "should destroy area" do
    assert_difference("Area.count", -1) do
      delete area_url(@area), as: :json
    end

    assert_response :no_content
  end
end

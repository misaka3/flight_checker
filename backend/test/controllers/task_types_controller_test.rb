require "test_helper"

class TaskTypesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task_type = task_types(:one)
  end

  test "should get index" do
    get task_types_url, as: :json
    assert_response :success
  end

  test "should create task_type" do
    assert_difference("TaskType.count") do
      post task_types_url, params: { task_type: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show task_type" do
    get task_type_url(@task_type), as: :json
    assert_response :success
  end

  test "should update task_type" do
    patch task_type_url(@task_type), params: { task_type: {  } }, as: :json
    assert_response :success
  end

  test "should destroy task_type" do
    assert_difference("TaskType.count", -1) do
      delete task_type_url(@task_type), as: :json
    end

    assert_response :no_content
  end
end

class WaypointsController < ApplicationController
  before_action :set_waypoint, only: %i[ show update destroy ]

  # GET /waypoints
  def index
    @waypoints = Waypoint.all

    render json: @waypoints
  end

  # GET /waypoints/1
  def show
    render json: @waypoint
  end

  # POST /waypoints
  def create
    @waypoint = Waypoint.new(waypoint_params)

    if @waypoint.save
      render json: @waypoint, status: :created, location: @waypoint
    else
      render json: @waypoint.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /waypoints/1
  def update
    if @waypoint.update(waypoint_params)
      render json: @waypoint
    else
      render json: @waypoint.errors, status: :unprocessable_entity
    end
  end

  # DELETE /waypoints/1
  def destroy
    @waypoint.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_waypoint
      @waypoint = Waypoint.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def waypoint_params
      params.require(:waypoint).permit(:file_name, :data)
    end
end

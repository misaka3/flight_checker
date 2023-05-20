class GpxLogsController < ApplicationController
  before_action :set_gpx_log, only: %i[ show update destroy ]

  # GET /gpx_logs
  def index
    @gpx_logs = GpxLog.all

    render json: @gpx_logs
  end

  # GET /gpx_logs/1
  def show
    render json: @gpx_log
  end

  # POST /gpx_logs
  def create
    @gpx_log = GpxLog.new(gpx_log_params)

    if @gpx_log.save
      render json: @gpx_log, status: :created, location: @gpx_log
    else
      render json: @gpx_log.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /gpx_logs/1
  def update
    if @gpx_log.update(gpx_log_params)
      render json: @gpx_log
    else
      render json: @gpx_log.errors, status: :unprocessable_entity
    end
  end

  # DELETE /gpx_logs/1
  def destroy
    @gpx_log.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gpx_log
      @gpx_log = GpxLog.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def gpx_log_params
      params.require(:gpx_log).permit(:file_name, :file_url, :file)
    end
end

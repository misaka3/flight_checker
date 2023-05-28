class GpxLogsController < ApplicationController
  before_action :set_gpx_log, only: %i[ show update destroy ]
  require 'aws-sdk-s3'

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
    @gpx_log = GpxLog.new(file_name: params[:filename])
    upload_to_s3(params[:file], params[:filename])

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
      params.require(:gpx_log).permit(:file, :file_name, :file_url)
    end

    def upload_to_s3(upload_file, file_name)
      region = ENV['AWS_REGION']
      bucket = ENV['S3_BUCKET_NAME']
      client = Aws::S3::Client.new(region: region)
  
      client.put_object(bucket: bucket, key: file_name, body: upload_file.read) 
    end
end

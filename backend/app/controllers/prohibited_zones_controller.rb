class ProhibitedZonesController < ApplicationController
  before_action :set_prohibited_zone, only: %i[ show update destroy ]

  # GET /prohibited_zones
  def index
    @prohibited_zones = ProhibitedZone.all

    render json: @prohibited_zones
  end

  # GET /prohibited_zones/1
  def show
    render json: @prohibited_zone
  end

  # POST /prohibited_zones
  def create
    @prohibited_zone = ProhibitedZone.new(prohibited_zone_params)

    if @prohibited_zone.save
      render json: @prohibited_zone, status: :created, location: @prohibited_zone
    else
      render json: @prohibited_zone.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /prohibited_zones/1
  def update
    if @prohibited_zone.update(prohibited_zone_params)
      render json: @prohibited_zone
    else
      render json: @prohibited_zone.errors, status: :unprocessable_entity
    end
  end

  # DELETE /prohibited_zones/1
  def destroy
    @prohibited_zone.destroy
  end

  private
    def set_prohibited_zone
      @prohibited_zone = ProhibitedZone.find(params[:id])
    end

    def prohibited_zone_params
      params.require(:prohibited_zone).permit(:area_id, :name, :pz_type, :longitude, :latitude, :radius, :altitude)
    end
end

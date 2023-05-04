class Area < ApplicationRecord
  has_many :events
  has_many :prohibited_zones
end

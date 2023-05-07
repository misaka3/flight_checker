class Event < ApplicationRecord
  belongs_to :area
  has_many :flights
end

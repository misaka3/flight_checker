class Flight < ApplicationRecord
  belongs_to :event
  has_many :tasks

  def area
    event.area
  end
end

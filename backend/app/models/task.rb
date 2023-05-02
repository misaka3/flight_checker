class Task < ApplicationRecord
  belongs_to :flight
  belongs_to :task_type
end

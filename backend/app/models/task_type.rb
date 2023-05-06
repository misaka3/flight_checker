class TaskType < ApplicationRecord
  has_many :tasks
  has_many :task_rules
end

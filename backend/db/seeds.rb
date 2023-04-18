require "csv"

# task_types
unless TaskType.exists?
  CSV.foreach('db/seeds/csv/task_type.csv', headers: true) do |task|
    TaskType.create(
      name: task['name'],
      short_name: task['short_name'],
      description: task['description']
    )
  end
end

# areas
unless Area.exists?
  CSV.foreach('db/seeds/csv/area.csv', headers: true) do |area|
    Area.create(
      name: area['name']
    )
  end
end
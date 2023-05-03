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
      name: area['name'],
      utm_zone: area['utm_zone']
    )
  end
end

# prohibited_zones
unless ProhibitedZone.exists?
  CSV.foreach('db/seeds/csv/prohibited_zone.csv', headers: true) do |pz|
    ProhibitedZone.create(
      area_id: pz['area_id'],
      name: pz['name'],
      pz_type: pz['pz_type'],
      grid_type: pz['grid_type'],
      longitude: pz['longitude'],
      latitude: pz['latitude'],
      utm_coordinates: pz['utm_coordinates'],
      radius: pz['radius'],
      altitude: pz['altitude']
    )
  end
end

# events
unless Event.exists?
  CSV.foreach('db/seeds/csv/event.csv', headers: true) do |event|
    Event.create(
      name: event['name'],
      area_id: event['area_id'],
      director: event['director'],
      start_term: event['start_term'],
      end_term: event['end_term']
    )
  end
end


# flights
unless Flight.exists?
  CSV.foreach('db/seeds/csv/flight.csv', headers: true) do |f|
    Flight.create(
      event_id: f['event_id'],
      task_briefing_datetime: f['task_briefing_datetime'],
      order_type: f['order_type'],
      launch_period: f['launch_period'],
      observer: f['observer'],
      next_briefing: f['next_briefing'],
      qnh: f['qnh'],
      launch_reqmts: f['launch_reqmts'],
      clp: f['clp'],
      solo_flight: f['solo_flight'],
      search_period: f['search_period'],
      sunrise: f['sunrise'],
      sunset: f['sunset'],
      notes: f['notes']
    )
  end
end

# tasks
unless Task.exists?
  CSV.foreach('db/seeds/csv/task.csv', headers: true) do |t|
    Task.create(
      task_type_id: t['task_type_id'],
      flight_id: t['flight_id'],
      task_num: t['task_num'],
      rule: t['rule'],
      marker_color: t['marker_color'],
      marker_drop: t['marker_drop'],
      mma: t['mma'],
      logger_marker: t['logger_marker'],
      description: t['description'],
      scoring_period: t['scoring_period'],
      scoring_area: t['scoring_area']
    )
  end
end
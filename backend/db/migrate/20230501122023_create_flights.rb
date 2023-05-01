class CreateFlights < ActiveRecord::Migration[7.0]
  def change
    create_table :flights do |t|
      t.references :event, null: false
      t.datetime :task_briefing_datetime, null: false
      t.boolean :order_type, null: false
      t.string :launch_period, null: false
      t.boolean :observer, null: false
      t.string :next_briefing, null: false
      t.string :qnh, null: false
      t.string :launch_reqmts, null: false
      t.string :clp, null: false
      t.boolean :solo_flight, null: false
      t.string :search_period, null: false
      t.time :sunrise, null: false
      t.time :sunset, null: false
      t.string :notes

      t.timestamps
    end
  end
end

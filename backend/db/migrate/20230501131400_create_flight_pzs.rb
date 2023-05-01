class CreateFlightPzs < ActiveRecord::Migration[7.0]
  def change
    create_table :flight_pzs do |t|
      t.references :flight, null: false
      t.references :prohibited_zone, null: false

      t.timestamps
    end
  end
end

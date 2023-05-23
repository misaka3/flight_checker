class CreateWaypoints < ActiveRecord::Migration[7.0]
  def change
    create_table :waypoints do |t|
      t.string :file_name, null: false
      t.string :data, null: false

      t.timestamps
    end
  end
end

class CreateProhibitedZones < ActiveRecord::Migration[7.0]
  def change
    create_table :prohibited_zones do |t|
      t.references :area, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :pz_type, null: false, default: 0
      t.boolean :grid_type, null: false, default: 0
      t.decimal :longitude, precision: 13, scale: 10
      t.decimal :latitude, precision: 13, scale: 10
      t.string :utm_coordinates
      t.integer :radius
      t.integer :altitude

      t.timestamps
    end
  end
end

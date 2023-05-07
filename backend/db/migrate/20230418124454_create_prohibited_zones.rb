class CreateProhibitedZones < ActiveRecord::Migration[7.0]
  def change
    create_table :prohibited_zones do |t|
      t.references :area, null: false
      t.string :name, null: false
      t.integer :pz_type, null: false, default: 0
      t.json :data, null: false

      t.timestamps
    end
  end
end

class CreateEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :events do |t|
      t.string   :name, null: false, unique: true
      t.references :area, null: false, foreign_key: true
      t.string   :director
      t.datetime :start_term
      t.datetime :end_term

      t.timestamps
    end
  end
end

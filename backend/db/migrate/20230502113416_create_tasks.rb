class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.references :task_type, null: false
      t.references :flight, null: false
      t.integer :task_num, null: false
      t.string :rule, null: false
      t.string :marker_color
      t.string :marker_drop
      t.string :mma
      t.string :logger_marker
      t.text :description
      t.string :scoring_period, null: false
      t.string :scoring_area, null: false

      t.timestamps
    end
  end
end

class CreateTaskTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :task_types do |t|
      t.string :name, null: false, unique: true
      t.string :short_name, null: false, unique: true
      t.string :description

      t.timestamps
    end
  end
end

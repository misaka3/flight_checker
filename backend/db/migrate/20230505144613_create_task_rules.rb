class CreateTaskRules < ActiveRecord::Migration[7.0]
  def change
    create_table :task_rules do |t|
      t.references :task_type, null: false
      t.string :rule_num, null: false
      t.text :content, null: false

      t.timestamps
    end
  end
end

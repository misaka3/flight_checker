class CreateGpxLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :gpx_logs do |t|
      t.string :file_name, null: false
      t.string :file_url

      t.timestamps
    end
  end
end

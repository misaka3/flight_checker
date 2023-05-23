# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_05_23_081835) do
  create_table "areas", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "utm_zone"
    t.json "initial_viewstate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "area_id", null: false
    t.string "director"
    t.datetime "start_term"
    t.datetime "end_term"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["area_id"], name: "index_events_on_area_id"
  end

  create_table "flight_pzs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "flight_id", null: false
    t.bigint "prohibited_zone_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flight_id"], name: "index_flight_pzs_on_flight_id"
    t.index ["prohibited_zone_id"], name: "index_flight_pzs_on_prohibited_zone_id"
  end

  create_table "flights", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.datetime "task_briefing_datetime", null: false
    t.boolean "order_type", null: false
    t.string "launch_period", null: false
    t.boolean "observer", null: false
    t.string "next_briefing", null: false
    t.string "qnh", null: false
    t.string "launch_reqmts", null: false
    t.string "clp", null: false
    t.boolean "solo_flight", null: false
    t.string "search_period", null: false
    t.time "sunrise", null: false
    t.time "sunset", null: false
    t.string "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_flights_on_event_id"
  end

  create_table "gpx_logs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "file_name", null: false
    t.string "file_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "prohibited_zones", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "area_id", null: false
    t.string "name", null: false
    t.integer "pz_type", default: 0, null: false
    t.json "data", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["area_id"], name: "index_prohibited_zones_on_area_id"
  end

  create_table "task_rules", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "task_type_id", null: false
    t.string "rule_num", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_type_id"], name: "index_task_rules_on_task_type_id"
  end

  create_table "task_types", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "en_name", null: false
    t.string "short_name", null: false
    t.string "rule_num", null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tasks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "task_type_id", null: false
    t.bigint "flight_id", null: false
    t.integer "task_num", null: false
    t.string "rule", null: false
    t.string "marker_color"
    t.string "marker_drop"
    t.string "mma"
    t.string "logger_marker"
    t.text "description"
    t.string "scoring_period", null: false
    t.string "scoring_area", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flight_id"], name: "index_tasks_on_flight_id"
    t.index ["task_type_id"], name: "index_tasks_on_task_type_id"
  end

  create_table "waypoints", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "file_name", null: false
    t.string "data", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

ActiveRecord::Schema[8.1].define(version: 2026_08_22_000000) do
  create_table "tasks", force: :cascade do |t|
    t.string "title", null: false
    t.boolean "done", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
end

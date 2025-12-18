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

ActiveRecord::Schema[8.1].define(version: 2025_12_18_100940) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admin_users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name"
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
  end

  create_table "answer_choices", force: :cascade do |t|
    t.bigint "answer_id", null: false
    t.bigint "choice_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answer_id", "choice_id"], name: "index_answer_choices_on_answer_id_and_choice_id", unique: true
    t.index ["answer_id"], name: "index_answer_choices_on_answer_id"
    t.index ["choice_id"], name: "index_answer_choices_on_choice_id"
  end

  create_table "answers", force: :cascade do |t|
    t.text "answer_text"
    t.bigint "attempt_id", null: false
    t.datetime "created_at", null: false
    t.bigint "question_id", null: false
    t.datetime "updated_at", null: false
    t.index ["attempt_id"], name: "index_answers_on_attempt_id"
    t.index ["question_id"], name: "index_answers_on_question_id"
  end

  create_table "attempts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "max_score", default: 0, null: false
    t.jsonb "metadata"
    t.string "public_session_id", null: false
    t.bigint "quiz_id", null: false
    t.integer "score", default: 0, null: false
    t.datetime "started_at", null: false
    t.datetime "submitted_at"
    t.datetime "updated_at", null: false
    t.index ["public_session_id"], name: "index_attempts_on_public_session_id"
    t.index ["quiz_id"], name: "index_attempts_on_quiz_id"
  end

  create_table "choices", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_correct", default: false, null: false
    t.integer "position"
    t.bigint "question_id", null: false
    t.string "text", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_choices_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "points", default: 1, null: false
    t.integer "position", null: false
    t.text "prompt", null: false
    t.integer "question_type", null: false
    t.bigint "quiz_id", null: false
    t.boolean "required", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id", "position"], name: "index_questions_on_quiz_id_and_position", unique: true
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "created_by_admin_user_id"
    t.text "description"
    t.string "slug", null: false
    t.integer "status", default: 0, null: false
    t.integer "time_limit_seconds"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_quizzes_on_slug", unique: true
  end

  add_foreign_key "answer_choices", "answers"
  add_foreign_key "answer_choices", "choices"
  add_foreign_key "answers", "attempts"
  add_foreign_key "answers", "questions"
  add_foreign_key "attempts", "quizzes"
  add_foreign_key "choices", "questions"
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quizzes", "admin_users", column: "created_by_admin_user_id"
end

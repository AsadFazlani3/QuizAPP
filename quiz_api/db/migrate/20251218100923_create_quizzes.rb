class CreateQuizzes < ActiveRecord::Migration[8.1]
  def change
    create_table :quizzes do |t|
      t.string :title, null: false
      t.text :description
      t.string :slug, null: false
      t.integer :status, default: 0, null: false
      t.integer :time_limit_seconds
      t.bigint :created_by_admin_user_id

      t.timestamps
    end

    add_index :quizzes, :slug, unique: true
    add_foreign_key :quizzes, :admin_users, column: :created_by_admin_user_id
  end
end

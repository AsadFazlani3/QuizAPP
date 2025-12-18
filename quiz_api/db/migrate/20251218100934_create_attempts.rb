class CreateAttempts < ActiveRecord::Migration[8.1]
  def change
    create_table :attempts do |t|
      t.references :quiz, null: false, foreign_key: true
      t.string :public_session_id, null: false
      t.datetime :started_at, null: false
      t.datetime :submitted_at
      t.integer :score, default: 0, null: false
      t.integer :max_score, default: 0, null: false
      t.jsonb :metadata

      t.timestamps
    end

    add_index :attempts, :public_session_id
  end
end

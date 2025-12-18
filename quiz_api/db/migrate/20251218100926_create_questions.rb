class CreateQuestions < ActiveRecord::Migration[8.1]
  def change
    create_table :questions do |t|
      t.references :quiz, null: false, foreign_key: true
      t.integer :question_type, null: false
      t.text :prompt, null: false
      t.integer :points, default: 1, null: false
      t.boolean :required, default: true, null: false
      t.integer :position, null: false

      t.timestamps
    end

    add_index :questions, [:quiz_id, :position], unique: true
  end
end

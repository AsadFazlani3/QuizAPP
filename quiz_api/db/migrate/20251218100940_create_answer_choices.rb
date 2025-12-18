class CreateAnswerChoices < ActiveRecord::Migration[8.1]
  def change
    create_table :answer_choices do |t|
      t.references :answer, null: false, foreign_key: true
      t.references :choice, null: false, foreign_key: true

      t.timestamps
    end

    add_index :answer_choices, [:answer_id, :choice_id], unique: true
  end
end

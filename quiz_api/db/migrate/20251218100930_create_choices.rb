class CreateChoices < ActiveRecord::Migration[8.1]
  def change
    create_table :choices do |t|
      t.references :question, null: false, foreign_key: true
      t.string :text, null: false
      t.boolean :is_correct, default: false, null: false
      t.integer :position

      t.timestamps
    end
  end
end

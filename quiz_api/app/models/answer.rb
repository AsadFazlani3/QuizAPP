class Answer < ApplicationRecord
  belongs_to :attempt
  belongs_to :question
  has_many :answer_choices, dependent: :destroy
  has_many :choices, through: :answer_choices
end

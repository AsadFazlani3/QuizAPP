class Question < ApplicationRecord
  enum :question_type, { mcq_single: 0, mcq_multi: 1, true_false: 2, text: 3 }

  belongs_to :quiz
  has_many :choices, -> { order(:position) }, dependent: :destroy

  validates :prompt, presence: true
  validates :position, presence: true, uniqueness: { scope: :quiz_id }

  validate :validate_choices_rules

  private

  def validate_choices_rules
    # Skip validation if question is new and has no choices (choices will be added separately)
    return if new_record? && choices.empty? && question_type != "text"
    
    case question_type
    when "mcq_single"
      if choices.size < 2
        errors.add(:base, "MCQ Single must have at least 2 choices")
      elsif choices.where(is_correct: true).count != 1
        errors.add(:base, "MCQ Single must have exactly 1 correct choice")
      end
    when "mcq_multi"
      if choices.size < 2
        errors.add(:base, "MCQ Multi must have at least 2 choices")
      elsif choices.where(is_correct: true).count < 1
        errors.add(:base, "MCQ Multi must have at least 1 correct choice")
      end
    when "true_false"
      true_choice = choices.find { |c| c.text&.downcase == "true" }
      false_choice = choices.find { |c| c.text&.downcase == "false" }
      if true_choice.nil? || false_choice.nil?
        errors.add(:base, "True/False must have exactly 2 choices with texts 'True' and 'False'")
      elsif choices.size != 2
        errors.add(:base, "True/False must have exactly 2 choices")
      elsif choices.where(is_correct: true).count != 1
        errors.add(:base, "True/False must have exactly 1 correct choice")
      end
    when "text"
      if choices.any?
        errors.add(:base, "Text questions must have 0 choices")
      end
    end
  end
end

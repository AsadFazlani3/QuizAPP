FactoryBot.define do
  factory :answer do
    association :attempt
    association :question
    answer_text { nil }
  end
end

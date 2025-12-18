FactoryBot.define do
  factory :choice do
    association :question
    text { Faker::Lorem.word }
    is_correct { false }
    position { 1 }
  end
end

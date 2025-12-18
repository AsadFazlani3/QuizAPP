FactoryBot.define do
  factory :question do
    association :quiz
    question_type { :mcq_single }
    prompt { Faker::Lorem.question }
    points { 1 }
    required { true }
    position { 1 }
  end
end

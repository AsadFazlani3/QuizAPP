FactoryBot.define do
  factory :attempt do
    association :quiz
    public_session_id { SecureRandom.uuid }
    started_at { Time.current }
    submitted_at { nil }
    score { 0 }
    max_score { 0 }
    metadata { {} }
  end
end

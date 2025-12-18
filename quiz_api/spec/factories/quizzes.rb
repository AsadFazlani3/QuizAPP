FactoryBot.define do
  factory :quiz do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    slug { Faker::Internet.slug }
    status { :draft }
    time_limit_seconds { 600 }
    association :created_by_admin_user, factory: :admin_user
  end
end

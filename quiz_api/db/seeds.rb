# Create admin user
puts "Creating admin user..."
admin = AdminUser.find_or_initialize_by(email: "admin@example.com")

if admin.new_record?
  admin.password = "password123"
  admin.password_confirmation = "password123"
  admin.name = "Admin User"
  admin.save!
  puts "✓ Created admin user: #{admin.email}"
else
  puts "✓ Admin user already exists: #{admin.email}"
end

puts "  Email: #{admin.email}"
puts "  Password: password123"
puts "  Name: #{admin.name || 'Not set'}"
puts ""

# Create a published quiz with all question types
quiz = Quiz.find_or_create_by!(slug: "sample-quiz") do |q|
  q.title = "Sample Quiz"
  q.description = "A sample quiz demonstrating all question types"
  q.status = :published
  q.time_limit_seconds = 600
  q.created_by_admin_user = admin
end

puts "Created quiz: #{quiz.title}"

# Clear existing questions for idempotency
quiz.questions.destroy_all

# MCQ Single question
q1 = quiz.questions.create!(
  question_type: :mcq_single,
  prompt: "What is 2 + 2?",
  points: 5,
  required: true,
  position: 1
)
q1.choices.create!([
  { text: "3", is_correct: false, position: 1 },
  { text: "4", is_correct: true, position: 2 },
  { text: "5", is_correct: false, position: 3 }
])
# Reload to ensure choices are loaded for validation
q1.reload

# MCQ Multi question
q2 = quiz.questions.create!(
  question_type: :mcq_multi,
  prompt: "Which are programming languages? (Select all that apply)",
  points: 10,
  required: true,
  position: 2
)
q2.choices.create!([
  { text: "Ruby", is_correct: true, position: 1 },
  { text: "Python", is_correct: true, position: 2 },
  { text: "HTML", is_correct: false, position: 3 },
  { text: "CSS", is_correct: false, position: 4 }
])
q2.reload

# True/False question
q3 = quiz.questions.create!(
  question_type: :true_false,
  prompt: "Rails is a Ruby web framework.",
  points: 3,
  required: true,
  position: 3
)
q3.choices.create!([
  { text: "True", is_correct: true, position: 1 },
  { text: "False", is_correct: false, position: 2 }
])
q3.reload

# Text question
q4 = quiz.questions.create!(
  question_type: :text,
  prompt: "Explain what REST stands for.",
  points: 5,
  required: false,
  position: 4
)

puts "Created #{quiz.questions.count} questions"
puts "Seeding complete!"

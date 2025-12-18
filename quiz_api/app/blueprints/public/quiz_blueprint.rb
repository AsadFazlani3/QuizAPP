class Public::QuizBlueprint < Blueprinter::Base
  identifier :id

  fields :title, :description, :slug, :time_limit_seconds

  association :questions, blueprint: ::Public::QuestionBlueprint
end


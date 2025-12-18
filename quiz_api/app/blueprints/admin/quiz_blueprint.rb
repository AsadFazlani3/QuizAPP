class Admin::QuizBlueprint < Blueprinter::Base
  identifier :id

  fields :title, :description, :slug, :status, :time_limit_seconds, :created_at, :updated_at

  association :created_by_admin_user, blueprint: ::AdminUserBlueprint
  association :questions, blueprint: ::Admin::QuestionBlueprint
end


class Admin::QuestionBlueprint < Blueprinter::Base
  identifier :id

  fields :question_type, :prompt, :points, :required, :position

  association :choices, blueprint: ::Admin::ChoiceBlueprint
end


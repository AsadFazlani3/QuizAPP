class Public::QuestionBlueprint < Blueprinter::Base
  identifier :id

  fields :question_type, :prompt, :points, :required, :position

  association :choices, blueprint: ::Public::ChoiceBlueprint
end


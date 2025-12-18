class Admin::ChoiceBlueprint < Blueprinter::Base
  identifier :id

  fields :text, :is_correct, :position
end


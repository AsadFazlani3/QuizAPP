class Public::ChoiceBlueprint < Blueprinter::Base
  identifier :id

  fields :text, :position
  # NOTE: is_correct is intentionally excluded from public blueprints
end


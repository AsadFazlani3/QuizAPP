module Api
  module V1
    module Admin
      class QuestionsController < BaseController
        def update
          question = Question.find(params[:id])

          ActiveRecord::Base.transaction do
            question.update!(question_params.except(:choices, :deleted_choice_ids))

            # Delete choices
            if params[:deleted_choice_ids].present?
              question.choices.where(id: params[:deleted_choice_ids]).destroy_all
            end

            # Update/create choices
            if params[:choices].present?
              update_choices(question, params[:choices])
            end

            question.reload
            if question.valid?
              render json: ::Admin::QuestionBlueprint.render(question)
            else
              raise ActiveRecord::RecordInvalid.new(question)
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          render_error("Validation failed", e.record.errors.messages)
        end

        def destroy
          question = Question.find(params[:id])
          question.destroy
          render json: { ok: true }
        end

        private

        def question_params
          params.permit(:prompt, :points, :required, :position, :question_type, choices: [:id, :temp_id, :text, :is_correct, :position], deleted_choice_ids: [])
        end

        def update_choices(question, choices_data)
          return if question.text?

          choices_data.each do |choice_data|
            if choice_data[:id].present?
              # Update existing
              choice = question.choices.find(choice_data[:id])
              choice.update!(
                text: choice_data[:text],
                is_correct: choice_data[:is_correct] || false,
                position: choice_data[:position]
              )
            else
              # Create new
              question.choices.create!(
                text: choice_data[:text],
                is_correct: choice_data[:is_correct] || false,
                position: choice_data[:position]
              )
            end
          end
        end
      end
    end
  end
end


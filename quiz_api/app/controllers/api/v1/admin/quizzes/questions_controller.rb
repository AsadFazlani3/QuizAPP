module Api
  module V1
    module Admin
      module Quizzes
        class QuestionsController < BaseController
          def create
            quiz = Quiz.find(params[:quiz_id])
            question = quiz.questions.build(question_params.except(:choices))

            ActiveRecord::Base.transaction do
              if question.save
                if question_params[:choices].present?
                  create_choices(question, question_params[:choices])
                elsif question.true_false?
                  create_true_false_choices(question)
                end

                question.reload
                if question.valid?
                  render json: ::Admin::QuestionBlueprint.render(question), status: :created
                else
                  raise ActiveRecord::RecordInvalid.new(question)
                end
              else
                render_error("Validation failed", question.errors.messages)
              end
            end
          rescue ActiveRecord::RecordInvalid => e
            render_error("Validation failed", e.record.errors.messages)
          end

          private

          def question_params
            params.permit(:question_type, :prompt, :points, :required, :position, choices: [:text, :is_correct, :position])
          end

          def create_choices(question, choices_data)
            return if question.text?

            choices_data.each do |choice_data|
              question.choices.create!(
                text: choice_data[:text],
                is_correct: choice_data[:is_correct] || false,
                position: choice_data[:position]
              )
            end
          end

          def create_true_false_choices(question)
            true_choice = question.choices.find_or_initialize_by(text: "True")
            true_choice.position = 1
            true_choice.is_correct = true unless question.choices.exists?(is_correct: true)
            true_choice.save!

            false_choice = question.choices.find_or_initialize_by(text: "False")
            false_choice.position = 2
            false_choice.is_correct = false
            false_choice.save!
          end
        end
      end
    end
  end
end


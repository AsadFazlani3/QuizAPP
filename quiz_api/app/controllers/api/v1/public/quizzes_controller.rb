module Api
  module V1
    module Public
      class QuizzesController < ActionController::API
        def index
          quizzes = Quiz.published.order(created_at: :desc)
          render json: {
            quizzes: quizzes.map { |q| {
              id: q.id,
              title: q.title,
              description: q.description,
              slug: q.slug,
              time_limit_seconds: q.time_limit_seconds,
              question_count: q.questions.count,
              created_at: q.created_at
            } }
          }
        end

        def show
          quiz = Quiz.published.find_by!(slug: params[:slug])
          render json: ::Public::QuizBlueprint.render(quiz)
        end
      end
    end
  end
end


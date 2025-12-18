module Api
  module V1
    module Public
      class AttemptsController < ActionController::API
        def create
          quiz = Quiz.published.find_by!(slug: params[:slug])
          attempt = quiz.attempts.create!(
            public_session_id: SecureRandom.uuid,
            started_at: Time.current
          )

          render json: {
            attempt_id: attempt.id,
            public_session_id: attempt.public_session_id,
            started_at: attempt.started_at
          }, status: :created
        end

        def submit
          attempt = Attempt.find(params[:attempt_id])

          if attempt.public_session_id != params[:public_session_id]
            render json: { error: { message: "Invalid session" } }, status: :unauthorized
            return
          end

          result = AttemptScoringService.new(attempt, params[:answers]).score

          render json: {
            attempt_id: attempt.id,
            score: attempt.score,
            max_score: attempt.max_score,
            results: result[:results]
          }
        end
      end
    end
  end
end


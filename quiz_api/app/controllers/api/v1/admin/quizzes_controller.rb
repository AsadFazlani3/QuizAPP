module Api
  module V1
    module Admin
      class QuizzesController < BaseController
        def index
          quizzes = Quiz.order(updated_at: :desc).page(params[:page]).per(params[:per] || 20)
          render json: {
            quizzes: quizzes.map { |q| { id: q.id, title: q.title, slug: q.slug, status: q.status, updated_at: q.updated_at } },
            meta: {
              current_page: quizzes.current_page,
              total_pages: quizzes.total_pages,
              total_count: quizzes.total_count
            }
          }
        end

        def show
          quiz = Quiz.find(params[:id])
          render json: ::Admin::QuizBlueprint.render(quiz)
        end

        def create
          quiz = Quiz.new(quiz_params)
          quiz.created_by_admin_user_id = @current_admin_user.id

          if quiz.save
            render json: ::Admin::QuizBlueprint.render(quiz), status: :created
          else
            render_error("Validation failed", quiz.errors.messages)
          end
        end

        def update
          quiz = Quiz.find(params[:id])

          if quiz.update(quiz_params)
            render json: ::Admin::QuizBlueprint.render(quiz)
          else
            render_error("Validation failed", quiz.errors.messages)
          end
        end

        def destroy
          quiz = Quiz.find(params[:id])
          quiz.destroy
          render json: { ok: true }
        end

        def publish
          quiz = Quiz.find(params[:id])

          if quiz.questions.empty?
            render_error("Cannot publish quiz without questions")
            return
          end

          quiz.update(status: :published)
          render json: ::Admin::QuizBlueprint.render(quiz)
        end

        private

        def quiz_params
          params.permit(:title, :description, :time_limit_seconds, :status)
        end
      end
    end
  end
end


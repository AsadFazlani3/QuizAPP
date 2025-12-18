Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      namespace :admin do
        post "auth/login", to: "auth#login"
        post "auth/logout", to: "auth#logout"

        resources :quizzes do
          post :publish, on: :member
          resources :questions, only: [:create], module: :quizzes
        end

        resources :questions, only: [:update, :destroy]
      end

      namespace :public do
        get "quizzes", to: "quizzes#index"
        get "quizzes/:slug", to: "quizzes#show"
        post "quizzes/:slug/attempts", to: "attempts#create"
        post "attempts/:attempt_id/submit", to: "attempts#submit"
      end
    end
  end
end

require 'rails_helper'

RSpec.describe "Admin Quizzes", type: :request do
  let(:admin_user) { create(:admin_user) }
  let(:token) { JwtService.encode({ admin_user_id: admin_user.id }) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  describe "POST /api/v1/admin/quizzes" do
    it "creates a quiz" do
      post "/api/v1/admin/quizzes", params: {
        title: "Test Quiz",
        description: "Test Description",
        time_limit_seconds: 600
      }, headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["title"]).to eq("Test Quiz")
      expect(json["created_by_admin_user"]["id"]).to eq(admin_user.id)
    end
  end

  describe "GET /api/v1/admin/quizzes/:id" do
    let(:quiz) { create(:quiz, created_by_admin_user: admin_user) }

    it "returns quiz with questions" do
      question = create(:question, quiz: quiz, position: 1)
      create(:choice, question: question, text: "A", is_correct: true)

      get "/api/v1/admin/quizzes/#{quiz.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(quiz.id)
      expect(json["questions"]).to be_an(Array)
      expect(json["questions"][0]["choices"][0]["is_correct"]).to be true
    end
  end
end


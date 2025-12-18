require 'rails_helper'

RSpec.describe "Public Quizzes", type: :request do
  let(:admin_user) { create(:admin_user) }
  let(:quiz) { create(:quiz, status: :published, slug: "test-quiz", created_by_admin_user: admin_user) }

  describe "GET /api/v1/public/quizzes/:slug" do
    it "returns published quiz without is_correct" do
      question = create(:question, quiz: quiz, question_type: :mcq_single)
      create(:choice, question: question, text: "A", is_correct: true)
      create(:choice, question: question, text: "B", is_correct: false)

      get "/api/v1/public/quizzes/#{quiz.slug}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["slug"]).to eq("test-quiz")
      expect(json["questions"][0]["choices"]).to be_an(Array)
      json["questions"][0]["choices"].each do |choice|
        expect(choice).not_to have_key("is_correct")
      end
    end

    it "does not return draft quiz" do
      draft_quiz = create(:quiz, status: :draft, slug: "draft-quiz", created_by_admin_user: admin_user)

      expect {
        get "/api/v1/public/quizzes/#{draft_quiz.slug}"
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end


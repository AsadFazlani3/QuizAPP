require 'rails_helper'

RSpec.describe "Admin Questions", type: :request do
  let(:admin_user) { create(:admin_user) }
  let(:token) { JwtService.encode({ admin_user_id: admin_user.id }) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }
  let(:quiz) { create(:quiz, created_by_admin_user: admin_user) }

  describe "POST /api/v1/admin/quizzes/:quiz_id/questions" do
    it "creates a question with choices" do
      post "/api/v1/admin/quizzes/#{quiz.id}/questions", params: {
        question_type: "mcq_single",
        prompt: "What is 2+2?",
        points: 5,
        required: true,
        position: 1,
        choices: [
          { text: "3", is_correct: false, position: 1 },
          { text: "4", is_correct: true, position: 2 }
        ]
      }, headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["prompt"]).to eq("What is 2+2?")
      expect(json["choices"].size).to eq(2)
      expect(json["choices"].find { |c| c["is_correct"] }).to be_present
    end

    it "creates true_false question with auto-created choices" do
      post "/api/v1/admin/quizzes/#{quiz.id}/questions", params: {
        question_type: "true_false",
        prompt: "Rails is a framework",
        points: 3,
        required: true,
        position: 1
      }, headers: headers

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["choices"].size).to eq(2)
      expect(json["choices"].map { |c| c["text"] }).to match_array(["True", "False"])
    end
  end

  describe "PATCH /api/v1/admin/questions/:id" do
    let(:question) { create(:question, quiz: quiz, question_type: :mcq_single) }
    let!(:choice1) { create(:choice, question: question, text: "A", is_correct: true, position: 1) }
    let!(:choice2) { create(:choice, question: question, text: "B", is_correct: false, position: 2) }

    it "updates question and choices" do
      patch "/api/v1/admin/questions/#{question.id}", params: {
        prompt: "Updated prompt",
        points: 10,
        choices: [
          { id: choice1.id, text: "Updated A", is_correct: true, position: 1 },
          { temp_id: "tmp-1", text: "New C", is_correct: false, position: 3 }
        ],
        deleted_choice_ids: [choice2.id]
      }, headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["prompt"]).to eq("Updated prompt")
      expect(json["choices"].size).to eq(2)
    end
  end

  describe "DELETE /api/v1/admin/questions/:id" do
    let(:question) { create(:question, quiz: quiz) }

    it "deletes question" do
      delete "/api/v1/admin/questions/#{question.id}", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["ok"]).to be true
    end
  end
end


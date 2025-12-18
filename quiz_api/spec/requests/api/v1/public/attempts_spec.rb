require 'rails_helper'

RSpec.describe "Public Attempts", type: :request do
  let(:admin_user) { create(:admin_user) }
  let(:quiz) { create(:quiz, status: :published, slug: "test-quiz", created_by_admin_user: admin_user) }

  describe "POST /api/v1/public/quizzes/:slug/attempts" do
    it "creates an attempt" do
      post "/api/v1/public/quizzes/#{quiz.slug}/attempts"

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["attempt_id"]).to be_present
      expect(json["public_session_id"]).to be_present
      expect(json["started_at"]).to be_present
    end
  end

  describe "POST /api/v1/public/attempts/:attempt_id/submit" do
    let(:attempt) { create(:attempt, quiz: quiz, public_session_id: SecureRandom.uuid) }
    let(:question1) { create(:question, quiz: quiz, question_type: :mcq_single, points: 5, position: 1) }
    let(:question2) { create(:question, quiz: quiz, question_type: :mcq_multi, points: 10, position: 2) }
    let(:question3) { create(:question, quiz: quiz, question_type: :true_false, points: 3, position: 3) }
    let(:question4) { create(:question, quiz: quiz, question_type: :text, points: 5, position: 4) }

    let(:correct_choice1) { create(:choice, question: question1, text: "Correct", is_correct: true, position: 1) }
    let(:wrong_choice1) { create(:choice, question: question1, text: "Wrong", is_correct: false, position: 2) }

    let(:correct_choice2a) { create(:choice, question: question2, text: "A", is_correct: true, position: 1) }
    let(:correct_choice2b) { create(:choice, question: question2, text: "B", is_correct: true, position: 2) }
    let(:wrong_choice2) { create(:choice, question: question2, text: "C", is_correct: false, position: 3) }

    let(:true_choice) { create(:choice, question: question3, text: "True", is_correct: true, position: 1) }
    let(:false_choice) { create(:choice, question: question3, text: "False", is_correct: false, position: 2) }

    before do
      correct_choice1
      wrong_choice1
      correct_choice2a
      correct_choice2b
      wrong_choice2
      true_choice
      false_choice
    end

    it "scores mcq_single correctly" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question1.id, choice_ids: [correct_choice1.id] }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["score"]).to eq(5)
      expect(json["results"][0]["correct"]).to be true
    end

    it "scores mcq_single incorrectly" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question1.id, choice_ids: [wrong_choice1.id] }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["score"]).to eq(0)
      expect(json["results"][0]["correct"]).to be false
    end

    it "scores mcq_multi with exact set correctly" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question2.id, choice_ids: [correct_choice2a.id, correct_choice2b.id] }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["score"]).to eq(10)
      expect(json["results"][0]["correct"]).to be true
    end

    it "scores mcq_multi with partial set incorrectly" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question2.id, choice_ids: [correct_choice2a.id] }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["score"]).to eq(0)
      expect(json["results"][0]["correct"]).to be false
    end

    it "scores true_false correctly" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question3.id, choice_ids: [true_choice.id] }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["score"]).to eq(3)
      expect(json["results"][0]["correct"]).to be true
    end

    it "handles text questions with correct=null" do
      post "/api/v1/public/attempts/#{attempt.id}/submit", params: {
        public_session_id: attempt.public_session_id,
        answers: [
          { question_id: question4.id, answer_text: "Some answer" }
        ]
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["results"][0]["correct"]).to be_nil
      expect(json["results"][0]["note"]).to eq("Text answers are not auto-graded.")
      expect(json["max_score"]).to eq(5) # Text question still counts in max_score
    end
  end
end


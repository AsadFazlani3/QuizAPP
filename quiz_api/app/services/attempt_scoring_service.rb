class AttemptScoringService
  def initialize(attempt, answers_data)
    @attempt = attempt
    @answers_data = answers_data
    @results = []
  end

  def score
    ActiveRecord::Base.transaction do
      @max_score = @attempt.quiz.questions.sum(:points)
      @score = 0

      @answers_data.each do |answer_data|
        question = @attempt.quiz.questions.find(answer_data[:question_id])
        answer = @attempt.answers.create!(question: question, answer_text: answer_data[:answer_text])

        result = score_answer(answer, question, answer_data)
        @results << result
        @score += result[:points] || 0
      end

      @attempt.update!(
        score: @score,
        max_score: @max_score,
        submitted_at: Time.current
      )

      { results: @results }
    end
  end

  private

  def score_answer(answer, question, answer_data)
    case question.question_type
    when "text"
      answer.update!(answer_text: answer_data[:answer_text])
      {
        question_id: question.id,
        correct: nil,
        note: "Text answers are not auto-graded.",
        points: 0
      }
    when "mcq_single", "true_false"
      selected_choice_ids = Array(answer_data[:choice_ids])
      correct_choice_ids = question.choices.where(is_correct: true).pluck(:id)

      selected_choice_ids.each do |choice_id|
        answer.answer_choices.create!(choice_id: choice_id)
      end

      correct = selected_choice_ids.sort == correct_choice_ids.sort
      points = correct ? question.points : 0

      {
        question_id: question.id,
        correct: correct,
        your_choice_ids: selected_choice_ids,
        correct_choice_ids: correct_choice_ids,
        points: points
      }
    when "mcq_multi"
      selected_choice_ids = Array(answer_data[:choice_ids]).sort
      correct_choice_ids = question.choices.where(is_correct: true).pluck(:id).sort

      selected_choice_ids.each do |choice_id|
        answer.answer_choices.create!(choice_id: choice_id)
      end

      correct = selected_choice_ids == correct_choice_ids
      points = correct ? question.points : 0

      {
        question_id: question.id,
        correct: correct,
        your_choice_ids: selected_choice_ids,
        correct_choice_ids: correct_choice_ids,
        points: points
      }
    end
  end
end


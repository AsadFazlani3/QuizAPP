class AdminUser < ApplicationRecord
  has_secure_password

  has_many :quizzes, foreign_key: :created_by_admin_user_id, dependent: :nullify

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :password_digest, presence: true

  before_validation :downcase_email

  private

  def downcase_email
    self.email = email&.downcase
  end
end

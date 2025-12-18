class Quiz < ApplicationRecord
  enum :status, { draft: 0, published: 1, archived: 2 }

  belongs_to :created_by_admin_user, class_name: "AdminUser"
  has_many :questions, -> { order(:position) }, dependent: :destroy
  has_many :attempts, dependent: :destroy

  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  private

  def generate_slug
    base_slug = title.parameterize
    candidate = base_slug
    suffix = 1

    while Quiz.exists?(slug: candidate)
      candidate = "#{base_slug}-#{suffix}"
      suffix += 1
    end

    self.slug = candidate
  end
end

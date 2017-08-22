class OldContact < ApplicationRecord
  # has_many :projects
  has_many :comments, as: :author

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates :phone, presence: true

  # Scopes
  # scope :located, -> { where(location: 'ZoomPop') }
  scope :sorted, -> { order(email: "ASC") }
  scope :newest_first, -> { order(created_at: "DESC") }
  scope :search, -> (query) {where(["email LIKE ?", "%#{query}%"])}

  before_save :format_email

  def format_email
    self.email = self.email.delete(' ').downcase
  end

  # methods
  def full_name
    "#{first_name} #{last_name}"
  end

end

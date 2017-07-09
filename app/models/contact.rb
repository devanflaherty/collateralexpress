class Contact < ApplicationRecord
  has_many :projects
  has_many :comments, as: :author

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates :phone, presence: true

  # Scopes
  scope :agency, -> { where(:branch => 'ZoomPop') }
  scope :sorted, -> { order(:email => "ASC") }
  scope :newest_first, -> { order(:created_at => "DESC") }
  scope :search, -> (query) {where(["email LIKE ?", "%#{query}%"])}

  # methods
  def full_name
    "#{first_name} #{last_name}"
  end

end

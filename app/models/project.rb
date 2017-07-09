class Project < ApplicationRecord
  extend FriendlyId
  friendly_id :permalinks, :use => :slugged

  def permalinks
    [:title,[:title, :due_date],]
  end

  def should_generate_new_friendly_id?
    title_changed?
  end

  mount_uploader :asset, AssetUploader

  belongs_to :contact, optional: true
  belongs_to :user
  has_many :comments
  has_many :medias

  # Validations
  #before_validation :create_slug, if: :title_changed?

  validates :title, presence: true
  validates :description, presence: true
  #validates :tactic, presence: true
  #validates :due_date, presence: true
  #validate  :at_least_one_file

  # Scopes
  scope :flagged, -> { where(:flag => true) }
  scope :archived, -> { where(:archive => true) }
  scope :exists, -> { where(:existing => true) }

  scope :pending, -> { where(:status => "Pending") }
  scope :ready, -> { where(:status => "Open") }
  scope :in_progress, -> { where(:status => "In Progress") }
  scope :complete, -> { where(:status => "Complete") }

  scope :sorted, -> { order(:created_at => "ASC") }
  scope :due_first, -> { order(:due_date => "DESC") }

  scope :belongs_to_contact, -> (query) {where(["contact_id LIKE ?", "%#{query}%"])}
  scope :belongs_to_user, -> (query) {where(["user_id LIKE ?", "%#{query}%"])}

  # methods
  def at_least_one_file
    if files.blank? || files.size < 1
      errors.add(:files, "must have at least one image")
    end
  end
end

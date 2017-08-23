class User < ApplicationRecord
  has_secure_password
  has_many :projects,:foreign_key => 'user_id'
  has_many :projects,:foreign_key => 'contact_id'
  has_many :comments, as: :author

  def full_name
    "#{first_name} #{last_name}"
  end


  validates :password,
          # you only need presence on create
          :presence => { :on => :create },
          # allow_nil for length (presence will handle it on create)
          :length   => { :minimum => 6, :allow_nil => true },
          # and use confirmation to ensure they always match
          :confirmation => true

  validates :password_confirmation,
            :presence=>true, :if => :password_digest_changed?

  scope :sorted, -> { order(email: "ASC") }
  scope :newest_first, -> { order(created_at: "DESC") }
  scope :admins, -> { where(role: 'admin') }
  scope :contacts, -> { where(role: 'contact') }
  scope :search, -> (query) {where(["email LIKE ?", "%#{query}%"])}

  def format_email
    self.email = self.email.delete(' ').downcase
  end

  def to_token_payload
    {
      sub: id,
      role: role,
      email: email
    }
  end

end

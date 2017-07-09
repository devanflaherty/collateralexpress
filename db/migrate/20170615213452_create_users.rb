class CreateUsers < ActiveRecord::Migration[5.1]

  def change
    create_table :users do |t|

      t.string :first_name,   :limit => 25
      t.string :last_name,    :limit => 50
      t.string :email,        :null => false, :default => '' 
      t.string :password,     :limit => 40
      t.string :phone
      t.string :branch
      t.string :position
      t.string :avatar
      t.timestamps
      # t.datetime "created_at"
      # t.datetime "updated_at"
    end
    add_index :users, :email, unique: true
  end

end

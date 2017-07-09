class CreateContacts < ActiveRecord::Migration[5.1]
  def change
    create_table :contacts do |t|
      t.string :first_name,   :limit => 25
      t.string :last_name,    :limit => 50
      t.string :email,        :null => false, :default => ''
      t.string :phone
      t.string :branch
      t.string :position
      t.string :avatar

      t.timestamps
    end
    add_index :contacts, :email, unique: true
  end
end

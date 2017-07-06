class CreateMedia < ActiveRecord::Migration[5.1]
  def change
    create_table :media do |t|
      t.references :project,    foreign_key: true
      t.string :file
      t.string :name
      t.timestamps
    end
  end
end

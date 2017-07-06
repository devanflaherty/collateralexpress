class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.references :project, foreign_key: true
      t.references :author, :polymorphic => true
      t.text :content

      t.timestamps
    end
    add_index :comments, [:project_id, :author_id]
  end
end

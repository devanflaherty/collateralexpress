class CreateProjects < ActiveRecord::Migration[5.1]
  def change
    create_table :projects do |t|
      t.integer :contact_id,    foreign_key: true
      t.references :user,       foreign_key: true

      t.string :title           #
      t.string :slug,           unique: true

      t.text :description       #
      t.text :tactic,            array: true, default: []
      t.string :target          #
      t.date :due_date          #
      t.string :business_unit   #
      t.boolean :existing       #
      t.integer :deliverables   #
      t.boolean :translation,   default: false
      t.string :reference       #

      t.string :asset
      t.text  :legal_review
      t.string :status          #
      t.boolean :flag,          default: false
      t.boolean :archive,       default: false

      t.timestamps
    end
    add_index :projects, :slug, unique: true
  end
end

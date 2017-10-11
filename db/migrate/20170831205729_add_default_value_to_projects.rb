class AddDefaultValueToProjects < ActiveRecord::Migration[5.1]
  def change
    change_column :projects, :existing, :boolean, :default => false
  end
end

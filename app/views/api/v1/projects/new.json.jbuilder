json.project do
  json.(@project, :id, :title, :status, :slug, :business_unit, :deliverables, :tactic, :target, :existing, :translation, :description, :reference, :due_date, :created_at, :archive, :flag, :asset, :legal_review, :contact_id, :user_id )
end
if @project.user
  json.user(@project.user, :id, :full_name, :email, :phone, :avatar)
end

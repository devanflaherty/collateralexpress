json.project do
  json.(@project, :id, :title, :status, :slug, :business_unit, :deliverables, :tactic, :target, :existing, :translation, :description, :reference, :due_date, :created_at, :archive, :flag, :asset, :legal_review, :contact_id, :user_id )
end
if @project.contact
  json.contact(@project.contact, :id, :full_name, :email, :phone, :location, :avatar)
end
if @project.user
  json.user(@project.user, :id, :full_name, :email, :phone, :avatar)
end
json.project_media do
  json.(@project, :medias)
end

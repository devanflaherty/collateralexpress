json.project do
  json.(@project, :id, :title, :status, :slug, :business_unit, :deliverables, :tactic, :target, :existing, :translation, :description)
  if @project.due_date
    json.due_date(@project.due_date.strftime('%b %e, %Y'))
  else
    json.due_date(@project.due_date)
  end
  json.created_at(@project.created_at.strftime('%b %e, %Y'))
  json.(@project, :archive, :flag, :asset, :legal_review, :contact_id, :user_id, :medias )
end
if @project.contact
  json.contact(@project.contact, :id, :full_name, :email, :phone, :branch, :position, :avatar)
end
if @user
  json.authenticated(@user, :id)
  if @project.user
    json.contact(@project.user, :id, :full_name, :email, :phone, :branch, :position, :avatar)
  end
end

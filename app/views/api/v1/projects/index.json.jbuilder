json.projects @projects do |project|
  json.(project, :id, :title, :description, :status)

  if project.contact
    json.contact do
      json.id project.contact.id
      json.name project.contact.full_name
      json.email project.contact.email
    end
  end
  #
  # json.assigned_user do
  #   json.id project.user.id
  #   json.name project.user.full_name
  #   json.email project.user.email
  # end
  #
  # json.comments project.comments do |comment|
  #   json.id comment.author.id
  #   json.author comment.author.full_name
  #   json.(comment, :content, :created_at)
  # end
end

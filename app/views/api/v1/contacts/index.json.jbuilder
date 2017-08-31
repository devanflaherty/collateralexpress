json.contact @contacts do |contact|
  json.(contact, :id, :email)
  #json.(contact, :id, :full_name, :first_name, :last_name, :email, :phone, :locaiton, :position)
  # json.projects contact.projects do |project|
  #   json.(project, :id, :title, :description)
  #   json.comments project.comments do |comment|
  #     json.author comment.author.full_name
  #     json.(comment, :content)
  #   end
  # end
end

json.users @users do |user|
  json.(user, :id, :email, :full_name, :phone)
  # json.projects user.projects do |project|
  #   json.(project, :id, :title, :description)
  #   json.comments project.comments do |comment|
  #     json.author comment.author.full_name
  #     json.(comment, :content)
  #   end
  # end
end

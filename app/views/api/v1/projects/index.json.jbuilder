json.current_page(@pagination[:current_page])
json.last_page(@pagination[:last_page])
json.next_page(@pagination[:next_page])
json.next_page_url(@pagination[:next_page_url])
json.prev_page(@pagination[:prev_page])
json.projects @projects do |project|
  json.(project, :id, :title, :description, :status, :archive)

  if project.contact
    json.contact do
      json.id project.contact.id
      json.name project.contact.full_name
      json.email project.contact.email
    end
  end
end

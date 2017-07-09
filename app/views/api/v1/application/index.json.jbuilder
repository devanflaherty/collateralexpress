json.array! @links do |link|
  json.(link, :name, :url)
end

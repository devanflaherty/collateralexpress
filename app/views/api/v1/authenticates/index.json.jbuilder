if @user[:id]
  json.user(@user, :id)
  json.role('admin')
elsif @contact[:id]
  json.user(@contact, :id)
  json.role('contact')
end

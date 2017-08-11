if @user
  json.(@user, :id, :email)
  json.role('admin')
end

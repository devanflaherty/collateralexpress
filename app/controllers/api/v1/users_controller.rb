class Api::V1::UsersController < ApiController
  before_action :authenticate_user
  skip_before_action :verify_authenticity_token, :only => [:destroy]

  def index
    query = request.query_parameters

    if query[:role]
      role = query[:role]
      if role == 'admin'
        @users = User.admins
      elsif role == 'contact'
        @users = User.contacts
      end
    else
      @users = User.all
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(user_params)
    # Set Role
    @user.role = 'admin'

    respond_to do |format|
      if @user.save
        cookies[:current_contact_id] = @user.id
        UserMailer.new_user(@user).deliver_later

        flash[:notice] = "User '#{@user.full_name}' created succesfully."

        format.json { render json: { user: @user, flash: flash} }
      else
        format.json { render json: { errors: @user.errors.messages }, status: 422}
      end
    end
  end

  # PUT /resource
  def update
    if params[:id] != nil
      id = params[:id]
    else
      id = current_user.id
    end
    @user = User.find(id)
    respond_to do |format|
      if @user.update_attributes(user_params)

        flash[:notice] = "User '#{@user.full_name}' updated succesfully."

        format.json { render json: { user: @user, flash: flash} }
      else
        flash[:error] = "User '#{@user.full_name}' failed to update."
        format.json { render json: { errors: @user.errors.messages }, status: 422}
      end
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    cookies.delete :current_contact_id
    flash[:notice] = "User '#{@user.full_name}' deleted succesfully."
    respond_to do |format|
      format.json { render json: {user: @user, flash: flash} }
    end
  end

  private
    def user_params
      params.require(:user).permit(
        :id, :first_name, :last_name, :phone, :email, :location, :superior, :password, :password_confirmation
        )
    end
end

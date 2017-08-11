class Users::RegistrationsController < Devise::RegistrationsController
  before_action :authenticate_user!, only: [:new, :create]
  skip_before_action :require_no_authentication
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]


  # GET /resource/sign_up
  def new
    redirect_to "/account/login"
  end

  # POST /resource
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        puts "-------------------"
        flash[:notice] = "Succesfully added user"
        @user = resource
        respond_to do |format|
          format.json { render json: {user: @user, flash: flash} }
        end
      else
        @user = resource
        flash[:notice] = "Something happened."
        respond_to do |format|
          format.json { render json: {user: resource, flash: flash} }
        end
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_to do |format|
        format.json { render json: { flash: flash} }
      end
    end
  end

  #GET /resource/edit
  def edit
    redirect_to "/account/edit"
  end

  # PUT /resource
  def update

    # required for settings form to submit when password is left blank
    if account_update_params[:password].blank?
      account_update_params.delete("password")
      account_update_params.delete("password_confirmation")
    end

    if account_update_params[:password] != account_update_params[:password_confirmation]
      flash[:notice] = "Passwords do not match"
      respond_to do |format|
        format.json { render json: {user: @user, flash: flash} }
      end
    else
      @user = User.find(current_user.id)
      @update = update_resource(@user, account_update_params)
      puts "----------------------------------------------"

      if @update
        # Sign in the user bypassing validation in case their password changed
        bypass_sign_in(@user)
        flash[:notice] = "succesfully updated"
        respond_to do |format|
          format.json { render json: {user: @user, flash: flash} }
        end
      else
        flash[:notice] = "No Update"
        respond_to do |format|
          format.json { render json: {user: @user, flash: flash} }
        end
      end
    end

  end

  # DELETE /resource
  def destroy
    if params[:id]
      @user = User.find(params[:id])

      if @user.destroy
        respond_to do |format|
          format.json { render json: {flash: flash} }
        end
      end
    end
  end

  def destroy_user
    if params[:id]
      @user = User.find(params[:id])

      if @user.destroy
        respond_to do |format|
          format.json { render json: {flash: flash} }
        end
      end
    end
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:id, :first_name, :last_name, :phone, :email, :password, :password_confirmation])
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:id, :first_name, :last_name, :phone, :email, :password, :password_confirmation])
  end

  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end

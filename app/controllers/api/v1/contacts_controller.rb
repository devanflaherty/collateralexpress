class Api::V1::ContactsController < ApiController
  skip_before_action :verify_authenticity_token, :only => [:clear]

  def index
    @contacts = User.contacts
  end

  def show
    @contact = User.find(params[:id])
  end

  def create
    @contact = User.new(contact_params)
    # Set Role
    @contact.role = 'contact'

    respond_to do |format|
      if @contact.save
        #using cookies so we can access ID via javascript
        cookies[:current_contact_id] = @contact.id
        UserMailer.new_contact(@contact).deliver_later

        # Set Responses
        flash[:notice] = "Contact '#{@contact.full_name}' added succesfully."
        format.json { render json: { contact: @contact, flash: flash} }
      else
        flash[:error] = "Contact '#{@contact.full_name}' failed to be saved."
        format.json { render json: { errors: @contact.errors.messages }, status: 422}
      end
    end
  end

  def update
    @contact = User.find(params[:id])
    respond_to do |format|
      # Using cookies so we can access ID via javascript
      puts "---Cookie Set---"
      cookies[:current_contact_id] = @contact.id
      if @contact.update_attributes(contact_params)
        # Find project if updated from project form
        # If project found we will save the updated contact to the found project
        # save_to_project

        # Set our responses
        flash[:notice] = "Contact '#{@contact.full_name}' updated succesfully."

        # Set our responses
        format.json { render json: { contact: @contact, flash: flash} }
      else
        flash[:error] = "Contact '#{@contact.full_name}' failed to update."
        format.json { render json: { errors: @contact.errors.messages }, status: 422}
      end
    end
  end

  def destroy
    @contact = User.find(params[:id])
    @contact.destroy
    flash[:notice] = "Contact '#{@contact.full_name}' deleted succesfully."
    respond_to do |format|
      format.json { render json: {flash: flash} }
    end
  end

  def edit
    if cookies[:current_contact_id] == params[:id]
      @contact = User.find(params[:id])
    else
      redirect_to '/'
    end
  end

  def clear
    if cookies[:current_contact_id]
      cookies.delete :current_contact_id
      flash[:notice] = "Removed saved contact."
      respond_to do |format|
        format.json { render :json => {flash: flash} }
      end
    end
  end

  private

    def contact_params
      params.require(:contact).permit(:first_name, :last_name, :password, :password_confirmation, :email, :phone, :location, :position, :avatar)
    end

    def save_to_project
      if params[:project]
        @project = Project.friendly.find(params[:project])
        @project.contact = @contact
        @project.save
      end
    end





end

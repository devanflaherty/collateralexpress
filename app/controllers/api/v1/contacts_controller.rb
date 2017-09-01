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
        UserMailer.new_contact(@contact).deliver_later

        # Set Responses
        flash[:notice] = "Contact '#{@contact.full_name}' added succesfully."
        format.json { render json: { contact: @contact, flash: flash, status: "created"} }
      else
        flash[:error] = "Contact '#{@contact.full_name}' failed to be saved."
        format.json { render json: { errors: @contact.errors.messages }, status: 422}
      end
    end
  end

  def update
    @contact = User.find(params[:id])
    respond_to do |format|
      if @contact.update_attributes(contact_params)
        # Set our responses
        flash[:notice] = "Contact '#{@contact.full_name}' updated succesfully."
        format.json { render json: { contact: @contact, flash: flash, status: "updated"} }
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
      params.require(:contact).permit(:first_name, :last_name, :password, :password_confirmation, :email, :phone, :location, :superior, :avatar)
    end

end

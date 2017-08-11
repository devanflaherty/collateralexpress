class ContactsController < ApplicationController
  def index
    @contacts = Contact.all
    respond_to do |format|
      format.json { render json: {flash: flash} }
    end
  end

  def create
    @contact = Contact.new(contact_params)

    respond_to do |format|
      if @contact.save
        #using cookies so we can access ID via javascript
        cookies[:current_contact_id] = @contact.id

        # Find project if updated from project form
        # If project found we will save the updated contact to the found project
        # save_to_project

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
    @contact = Contact.find(params[:id])
    respond_to do |format|
      # Using cookies so we can access ID via javascript
      puts "---Cookie Set---"
      cookies[:current_contact_id] = @contact.id
      if @contact.update_attributes(contact_params)
        # Find project if updated from project form
        # If project found we will save the updated contact to the found project
        # save_to_project

        # Set our responses
        flash.now[:notice] = "Contact '#{@contact.full_name}' updated succesfully."

        # Set our responses
        format.json { render json: { contact: @contact, flash: flash} }
      else
        flash[:error] = "Contact '#{@contact.full_name}' failed to update."
        format.json { render json: { errors: @contact.errors.messages }, status: 422}
      end
    end
  end

  def destroy
    @contact = Contact.find(params[:id])
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

  def login
    if params[:contact_email]
      if params[:persistent_url]
        url = params[:persistent_url]
      end

      @contact = Contact.search(params[:contact_email]).first
      if @contact
        if @contact[:id].to_i != cookies[:current_contact_id].to_i
          cookies[:current_contact_id] = @contact.id
          flash[:notice] = "Succesfully logged in #{@contact.full_name}."
        else
          flash[:notice] = "#{@contact.full_name} is already logged in."
        end

        respond_to do |format|
          format.json { render :json => {flash: flash, contact: @contact, url: url} }
        end
      end # if contact
    end # if params
  end

  def edit
    if cookies[:current_contact_id] == params[:id]
      @contact = Contact.find(params[:id])
    else
      redirect_to '/'
    end
  end

  private

    def contact_params
      params.require(:contact).permit(:first_name, :last_name, :email, :phone, :location, :position, :avatar)
    end

    def save_to_project
      if params[:project]
        @project = Project.friendly.find(params[:project])
        @project.contact = @contact
        @project.save
      end
    end
end

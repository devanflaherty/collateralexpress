class Api::V1::AuthenticatesController < ApplicationController
  #before_action :authenticate_user!

  def index
    if user_signed_in?
      @user = current_user
    else
      @user = {}
    end

    if cookies[:current_contact_id]
      @contact = Contact.find(cookies[:current_contact_id])
    else
      @contact = {}
    end
  end
  
end

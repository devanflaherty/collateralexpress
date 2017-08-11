class Api::V1::AuthenticateController < ApiController
  before_action :authenticate_user

  def index
    @user = current_user
    # # if user_signed_in?
    # #   @user = current_user
    # # else
    # #   @user = {}
    # # end
    #
    # if cookies[:current_contact_id]
    #   @contact = Contact.find(cookies[:current_contact_id])
    # else
    #   @contact = {}
    # end
    #
    # @loggedIn = true
  end

  def refresh
    @user = current_user
  end

end

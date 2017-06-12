class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    @links = [
      {
        name: "Link1",
        url: "http://saltagency.co"
      },
      {
        name: "link 2",
        url: "#hello"
      }
    ];

    respond_to do |format|
      format.html
      format.json { render :json => @links }
    end
  end
end

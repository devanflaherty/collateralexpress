class Api::V1::ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    @links = [
      {
        name: "Home",
        url: "/"
      },
      {
        name: "Send a Request",
        url: "/projects/new"
      },
      {
        name: "How It Works",
        url: "/how-it-works"
      },
      {
        name: "Gallery",
        url: "/gallery"
      },
      {
        name: "FAQ",
        url: "/faq"
      },
      {
        name: "Contact",
        url: "#launchContact"
      },
    ];
  end

end

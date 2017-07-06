class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :get_links

  private

  def get_links
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

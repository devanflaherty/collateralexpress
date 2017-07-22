class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :get_links

  private

  def get_links
    @links = [
      {
        name: "Create Project Request",
        url: "/projects/new#new"
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

    if user_signed_in?
      @links << {
        name: "Profile",
        url: "/account/edit"
      }
    end

    if user_signed_in? == false && cookies[:current_contact_id]
      @links << {
        name: "Profile",
        url: "/contacts/#{cookies[:current_contact_id]}/edit"
      }
    end

    if user_signed_in? || cookies[:current_contact_id]
      @links.insert(1, {
        name: "All Projects",
        url: "/projects#all"
      })
    end
  end

end

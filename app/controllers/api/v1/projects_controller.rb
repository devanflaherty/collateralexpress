class Api::V1::ProjectsController < ApplicationController
  before_action :define_project_lexicon, only: [:new, :edit]

  def index
    if user_signed_in?
      query = request.query_parameters
      if query.keys.count > 0
        if query[:q] == "flagged"
          @projects = Project.flagged.all
        elsif query[:q] == "complete"
          @projects = Project.complete.all
        elsif query[:q] == "archived"
          @projects = Project.archived.all
        elsif query[:q] == "duefirst"
          @projects = Project.due_first.all
        end
      else
        puts "---------------------"
        @projects = Project.all
      end

      @user = current_user
      @userProjects = @user.projects
    elsif cookies[:current_contact_id]
      puts "---------)))------------"
      @contact = Contact.find_by_id(cookies[:current_contact_id])
      @projects = @contact.projects
    else
      puts "---------****------------"
      @projects = Project.all
    end
  end

  def show
    if user_signed_in?
      @user = current_user
    end
    @project = Project.friendly.find(params[:id])
  end

  def new
    @project = Project.new
  end

  def edit
    if user_signed_in?
      @user = current_user
    end
    @project = Project.friendly.find(params[:id])
  end

  private

    def define_project_lexicon
      @states = [
        "Pending",
        "Open",
        "Need Info",
        "In Review",
        "In Progress",
        "Sent for Approval",
        "Complete"
      ]

      @tactics = [
        "Flyer",
        "Promotional Flyer",
        "Newsletter Template",
        "OFT Email",
        "Editable PDF",
        "Editable Web Form",
        "Infographics",
        "Powerpoint",
        "Social Graphics",
        "Social Content",
        "Event Banners",
        "Business Card",
        "Other"
      ]
    end
end

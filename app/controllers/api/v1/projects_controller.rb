class Api::V1::ProjectsController < ApplicationController
  before_action :define_project_lexicon, only: [:new, :edit]

  def index
    query_projects
  end

  def show
    if user_signed_in?
      @user = current_user
    end
    @project = Project.friendly.find(params[:id])
  end

  def new
    @project = Project.new
    @project[:status] = "open"
    @project[:title] = nil
    @project[:user_id] = 1
    @project[:deliverables] = "0"
  end

  def edit
    if user_signed_in?
      @user = current_user
    end
    @project = Project.friendly.find(params[:id])
  end

  private

    def query_projects
      if cookies[:current_contact_id]
        @authUser = Contact.find_by_id(cookies[:current_contact_id])
      end

      query = request.query_parameters

      if query[:page]
        page = query[:page]
      else
        page = 1
      end
      if query[:q]
        if query[:q] == "flagged"
          if @authUser
            @projects = @authUser.projects.flagged.page(page).per(10)
          else
            @projects = Project.flagged.page(page).per(10)
          end
        elsif query[:q] == "complete"
          if @authUser
            @projects = @authUser.projects.complete.page(page).per(10)
          else
            @projects = Project.complete.page(page).per(10)
          end
        elsif query[:q] == "archived"
          if @authUser
            @projects = @authUser.projects.archived.page(page).per(10)
          else
            @projects = Project.archived.page(page).per(10)
          end
        elsif query[:q] == "duefirst"
          if @authUser
            @projects = @authUser.projects.due_first.page(page).per(10)
          else
            @projects = Project.due_first.page(page).per(10)
          end
        end
      else
        if @authUser
          @projects = @authUser.projects.page(page).per(10)
        else
          @projects = Project.page(page).per(10)
        end
      end
      @pagination = {
        current_page: @projects.current_page,
        last_page: @projects.total_pages,
        next_page: @projects.next_page,
        next_page_url: @projects.next_page,
        prev_page: @projects.prev_page,
        prev_page_url: @projects.prev_page,
      }
    end

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

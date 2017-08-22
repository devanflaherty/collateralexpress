class Api::V1::ProjectsController < ApiController
  # before_action :authenticate_user, only: [:index, :show, :edit]
  skip_before_action :verify_authenticity_token, :only => [:destroy]
  before_action :find_contact
  before_action :define_project_lexicon, only: [:new, :create, :edit, :update]

  def index
    query_projects
  end

  def show
    @user = current_user
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

  def create
    @project = Project.new(project_params)
    respond_to do |format|
      if @project.save
        ProjectMailer.new_project(@project).deliver_later
        ProjectMailer.new_project_to_admin(@project).deliver_later

        flash.now[:notice] = "Project '#{@project.title}' created succesfully."

        format.json { render json: { project: @project, flash: flash} }
      else
        format.json { render json: { errors: @project.errors.messages }, status: 422}
      end
    end
  end

  def update
    @project = Project.friendly.find(params[:id])
    status = @project.status
    respond_to do |format|
      if @project.update_attributes(project_params)
        if @project.status != status
          ProjectMailer.status_update(@project).deliver_later
        end
        session[:current_contact_id] = @project.contact_id

        flash.now[:notice] = "Project '#{@project.title}' updated succesfully."

        format.json { render json: { project: @project, flash: flash} }
      else
        flash[:error] = "Project '#{@project.title}' failed to update."
        format.json { render json: { errors: @project.errors.messages }, status: 422}
      end
    end
  end

  def destroy
    @project = Project.friendly.find(params[:id])
    @project.medias.each do |m|
      m.destroy
    end
    @project.destroy
    flash.now[:notice] = "Project '#{@project.title}' deleted succesfully."
    respond_to do |format|
      format.json { render json: {project: @project, flash: flash} }
    end
  end

  # Uneeded routes because actions are handled via VUE
  # def show
  #   @project = Project.friendly.find(params[:id])
  # end
  #
  # def new
  #   @project = Project.new
  # end
  #
  # def edit
  #   @project = Project.friendly.find(params[:id])
  # end

  private

    def query_projects
      if current_user.role == 'contact'
        @authUser = current_user
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

    def find_contact
      @current_contact = session[:current_contact_id]
    end

    def project_params
      params.require(:project).permit(
        :id,
        :title,
        :status,
        :description,
        :due_date,
        :contact_id,
        :user_id,
        :archive,
        :flag,
        :asset,
        :reference,
        :deliverables,
        :existing,
        :business_unit,
        :target,
        :legal_review,
        { :tactic => [] }
        )
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

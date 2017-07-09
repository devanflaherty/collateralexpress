class ProjectsController < ApplicationController
  layout 'vue'
  before_action :find_contact
  before_action :define_project_lexicon, only: [:new, :create, :edit, :update]

  def index
    @projects = Project.all
    respond_to do |format|
      format.html
      format.json { render json: {flash: flash} }
    end
  end

  def create
    @project = Project.new(project_params)
    respond_to do |format|
      if @project.save
        ProjectMailer.new_project(@project).deliver

        flash[:notice] = "Project '#{@project.title}' created succesfully."

        session[:current_contact_id] = @project.contact_id

        format.json { render json: { project: @project, flash: flash} }
      else
        format.json { render :json => { :errors => @project.errors.messages }, :status => 422}
      end
    end
  end

  def update
    @project = Project.friendly.find(params[:id])
    status = @project.status
    respond_to do |format|
      if @project.update_attributes(project_params)
        if @project.status != status
          puts "changed"
          ProjectMailer.status_update(@project).deliver
        end
        session[:current_contact_id] = @project.contact_id

        flash[:notice] = "Project '#{@project.title}' updated succesfully."

        format.html { redirect_to(projects_path(@project)) }
        format.json { render json: { project: @project, flash: flash} }
      else
        flash[:error] = "Project '#{@project.title}' failed to update."
        format.html { render 'edit'}
        format.json { render :json => { :errors => @project.errors.messages }, :status => 422}
      end
    end
  end

  def destroy
    @project = Project.friendly.find(params[:id])
    @project.medias.each do |m|
      m.destroy
    end
    @project.destroy
    flash[:notice] = "Project '#{@project.title}' deleted succesfully."
    respond_to do |format|
      format.html { render 'index'}
      format.json { render :json => {project: @project, flash: flash, :redirect => "/projects"} }
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

    def project_params
      params.require(:project).permit(
        :id,
        :title,
        :status,
        :description,
        :due_date,
        :files,
        :contact_id,
        :user_id,
        :archive,
        :flag,
        :asset,
        :legal_review,
        { :tactic => [] }
        )
    end

    def find_contact
      @current_contact = session[:current_contact_id]
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

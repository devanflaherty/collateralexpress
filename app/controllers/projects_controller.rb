class ProjectsController < ApplicationController
  #before_action :authenticate_user!, except: [:index, :show, :new]
  before_action :find_contact
  before_action :define_project_lexicon, only: [:new, :create, :edit, :update]

  def index
    params
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
        ProjectMailer.new_project(@project).deliver_later
        ProjectMailer.new_project_to_admin(@project).deliver_later

        flash.now[:notice] = "Project '#{@project.title}' created succesfully."

        # session[:current_contact_id] = @project.contact_id

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
          puts "changed"
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
      format.html { render 'index'}
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

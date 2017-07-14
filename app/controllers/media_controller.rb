class MediaController < ApplicationController

  def create
    @media = Media.new(file: params[:file])
    @media.project = Project.find_by_id(params[:project_id])

    if @media.save!
      respond_to do |format|
        format.json{ render json: @media }
      end
    end
  end

  def destroy
    @media = Media.find(params[:id])
    @media.destroy
    FileUtils.remove_dir("#{Rails.root}/public/uploads/media/file/#{params[:id]}", force: true)
    flash[:notice] = "File deleted succesfully."
    respond_to do |format|
      format.html { render 'index'}
      format.json { render json: {flash: flash} }
    end
  end

  protected

end

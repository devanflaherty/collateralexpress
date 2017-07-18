class MediaController < ApplicationController

  def create
    @allMedia = Array.new
    params[:file].each do |key, val|
      puts "current_index: #{key} & #{val}"
      @media = Media.create(file: val, project_id: params[:project_id])

      if @media
        @allMedia << @media
      end
    end

    respond_to do |format|
      format.json{ render :json => @allMedia }
    end
  end

  def destroy
    @media = Media.find(params[:id])
    @media.destroy
    FileUtils.remove_dir("#{Rails.root}/public/uploads/media/file/#{params[:id]}", :force => true)
    flash[:notice] = "File deleted succesfully."
    respond_to do |format|
      format.html { render 'index'}
      format.json { render :json => {flash: flash} }
    end
  end

  protected

end

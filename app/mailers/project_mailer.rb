class ProjectMailer < ApplicationMailer

  def new_project(project)
    @project = project
    @contact = @project.contact
    @url  = "http://collateralexpress.com/"
    email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
    mail to: email_with_name, subject: "Your Project, #{@project.title}, saved succesfully"
  end

  def status_update(project)
    @project = project
    @contact = @project.contact
    @url  = "http://collateralexpress.com/"
    email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
    mail to: email_with_name, subject: "'#{@project.title}' status has been set to #{@project.status}"
  end

  # def completed_project(project)
  #   @project = project
  #   @contact = @project.contact
  #   @url  = "http://collateralexpress.com/"
  #   email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
  #   mail to: email_with_name, subject: "Collateral Express Update: #{@project.status}"
  # end
  #
  # def flagged_project(project)
  #   @project = project
  #   @contact = @project.contact
  #   @url  = "http://collateralexpress.com/"
  #   email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
  #   mail to: email_with_name, subject: "Collateral Express Update: #{@project.status}"
  # end
  #
  # def archived_project(project)
  #   @project = project
  #   @contact = @project.contact
  #   @url  = "http://collateralexpress.com/"
  #   email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
  #   mail to: email_with_name, subject: "Collateral Express Update: #{@project.status}"
  # end

end

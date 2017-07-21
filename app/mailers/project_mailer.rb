class ProjectMailer < ApplicationMailer

  def new_project(project)
    @project = project
    @contact = @project.contact
    @support_email = "coexdemo@gmail.com"
    @url  = "http://collateralexpress.com/"
    email_with_name = %("#{@contact.full_name}" <#{@contact.email}>)
    mail to: email_with_name, subject: "Your Project, #{@project.title}, saved succesfully"
  end

  def new_project_to_admin(project)
    @project = project
    @contact = @project.contact
    @user = @project.user
    @support_email = "coexdemo@gmail.com"
    @url  = "http://collateralexpress.com/"
    ronald_with_name = %("Ronald" <hello@saltagency.co>)
    user_with_name = %("#{@user.email}" <#{@user.email}>)
    emails = [ronald_with_name, user_with_name]
    mail to: emails, subject: "New Project '#{@project.title}'"
  end

  def status_update(project)
    @project = project
    @contact = @project.contact
    @support_email = "coexdemo@gmail.com"
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

class UserMailer < ApplicationMailer

  def new_user(user)
    @user = user
    @support_email = "coexdemo@gmail.com"
    @url  = "http://collateralexpress.com/"
    email_with_name = %("#{@user.full_name}" <#{@user.email}>)
    mail to: email_with_name, subject: "You Are Now an Admin at Collateral Express"
  end

  def new_contact(contact)
    @contact = contact
    @support_email = "coexdemo@gmail.com"
    @url  = "http://collateralexpress.com/"
    email_with_name = %("#{@user.full_name}" <#{@user.email}>)
    mail to: email_with_name, subject: "Welcome to Collateral Express"
  end

end

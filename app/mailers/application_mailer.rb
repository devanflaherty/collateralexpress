class ApplicationMailer < ActionMailer::Base
  default from: %(Collateral Express <#{ENV['GMAIL_USERNAME']}>)
  layout 'mailer'
end

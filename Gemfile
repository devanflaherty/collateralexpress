source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

#  Gemfile Contents
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#   01  Application
#   02. Authentication
#   03. Asset Management
#   04. Front End
#   05. Development Tools


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  01. Application
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.1'
# Use PostGres as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.6'
# User Carrierwave for image uploads and processing
gem 'carrierwave', '~> 1.0'
gem 'mini_magick', '~> 4.7'
# Provider to user AWS S3 storage in application
gem 'fog-aws', '~> 1.3'
# Populate fake data. Read more for data options: https://github.com/stympy/faker
gem 'faker', '~> 1.7', '>= 1.7.3'
# Slugging and permalink plugins for Active Record
gem 'friendly_id', '~> 5.2', '>= 5.2.1'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  02. Authentication
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Use devise as the user authentication handler
gem 'devise', '~> 4.2'
# User roles management
gem 'rolify', '~> 5.1'

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  03. Asset Management
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  04. Front End
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Use Font Awesome Icons
gem 'font-awesome-rails', '~> 4.7'
# Kaminari for record pagination
gem 'kaminari', '~> 1.0', '>= 1.0.1'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Use Figaro for environment variable Management
  gem 'figaro', '~> 1.1', '>= 1.1.1'
  # Annotate prepends descriptive comments to model resources. Read more: https://github.com/ctran/annotate_models
  gem 'annotate', github: 'ctran/annotate_models'

  # For Tests
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

ruby "2.4.0"

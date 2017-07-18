# Collateral Express
An online portal where T-Mobile employees can request *'T-Mobile @Work'*
marketing materials and collateral


| Specs       |                                                         |
|-------------|---------------------------------------------------------|
| Framework   | Ruby on Rails                                           |
| JS Frontend | Vue.js                                           |
| Hosting     | Heroku                                                  |
| Database    | Heroku PostGres                                         |
| Repo        | https://github.com/devanflaherty/colatteralexpress.git  |
| Email       | MailGun                                                 |

---

## Set-Up
First and foremost please ensure you have the below versions of Ruby and Rails installed on your machine.

*Ruby : '2.4.0'*  
*Rails : '5.1.1'*

Once your machine is running the correct version of Ruby and Rails then make sure you are in the app's root directory from your command prompt. The following command will install all the gems and dependencies for **RAILS** included in the 'Gemfile'. Please note we will need to run a 'YARN' command later for our front-end dependencies, but for now we are focusing on Rails.

```
  # Run to install gems and rails dependencies
  $ bundle
```

If that doesn't work for you then you most likely have a version issue or you don't have the gem 'Bundler' installed.

#### Database Configuration
We will need to make sure we can connect to a database to use the app. To do this please make sure you have Posgres installed and running on your local machine. I prefer installing PostGres over **Homebrew**, but you can use any preferred method. Ensure that PostGres is running and then from your command prompt in the app's root directory run the following command.

```
  # Run to set-up database
  $ rails db:setup

  # This will effectively run the following Rails commands
  # db:create : Creates the database
  # db:schema:load : Loads schema into current database
  # db:migrate : Migrates all the database migration files
  # db:seed : Set up to 
```

If you made it to here we are ready to get our basic Rails app Up and Running!

## Up and Running
Fill out info on how to get the rails server running, working with the rails console, etc.

---

## Front-End OverView
Collateral Express is an built using Rails 5.1 and utilizing Vue.js for some front-end components.
We will cover **Vue.JS**, webpack, as well as other front-end dependencies later, but first and foremost we must address that a few views and components of layouts are made utilizing **vue**. Corresponding vue components to rails views will be documented on the respective *Rails view*. Access Vue Components through `app -> webpack -> packs`.

#### How do we route and mount with Vue
Vue mounts to divs with a specified ID provided in the rails views, so, they are crucial to one another. Another crucial Rails aspect is default Rails Routing. We will only use 'vue routing' for the potential  switching of templates/components on desired pages (which will be documented in the respective rails view). Other than that we depend on Rails Routing fully.

#### Vue and API Digestion
Utilizing Vue.s as a front-end framework in conjunction with Rails means we have to forgo some of ROR's helpers. Rather than working with ERB and Rails built-in helpers we will be working with our apps API which we built with **jbuilder** (JBuilder Documentation)[https://github.com/rails/jbuilder]. Vue.js digests the json via a node module **Axios** which is a lightweight alternative to using ajax and jQuery.

For more on our API, JBuilder please scroll below.

---

## Rails Gems & Dependencies
With so many great gems we of course are using a few, below are the ones worth noting, and why we are using them. *For all used gems with simple annotation to purpose please read the Gemfile.*

#### WebPacker

#### JBuilder
https://github.com/rails/jbuilder

#### Devise & Rollify

#### Friendly ID
https://github.com/norman/friendly_id

#### carrierwave

#### Fog AWS

#### Faker

#### Font Awesome Rails

---

* System dependencies
- Ruby
- Rails
- Bundler
- Node
- Yarn
- PostGres

* Configuration

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

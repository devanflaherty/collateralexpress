Rails.application.routes.draw do
  root 'app#index'

  devise_for :users,
    path: 'account',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      password: 'password',
      confirmation: 'confirm',
      sign_up: 'signup'
    }

  resources :projects, :except => [:index, :new, :edit, :show]
  resources :contacts, :except => [:index, :new, :edit, :show]
  resources :media, only: [:create, :delete, :destroy]

  ##-------------------------------------------------------##
  ## API Resources                                         ##
  ##-------------------------------------------------------##
  namespace :api do
    namespace :v1 do
      resources :application
      resources :users
      resources :contacts
      resources :projects
    end
  end

  ##-------------------------------------------------------##
  ## Custom Routes                                         ##
  ##-------------------------------------------------------##
  post 'contacts/clear', to: 'contacts#clear', method: :post
  post 'contacts/login', to: 'contacts#login', method: :post
  get 'authenticate', to: 'authenticates#index'

  ##-------------------------------------------------------##
  ## Route to enable Vue Routes                            ##
  ##-------------------------------------------------------##
  get '*path', to: 'app#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

  # Default route : Try not to use
  # get ':controller(/:action(:id))'
end

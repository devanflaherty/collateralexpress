Rails.application.routes.draw do
  root 'pages#index'

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
  resources :contacts, :except => [:new, :show]
  post 'contacts/clear', to: 'contacts#clear', method: :post
  post 'contacts/login', to: 'contacts#login', method: :post
  get 'authenticate', to: 'authenticates#index'

  resources :media, only: [:create, :delete, :destroy]

  # Static Page routes
  get '/how-it-works', to: 'pages#howItWorks'
  get '/faq', to: 'pages#faq'
  get '/gallery', to: 'pages#gallery'

  # API
  namespace :api do
    namespace :v1 do
      resources :application
      resources :users
      resources :contacts
      resources :projects
    end
  end

  get '*path', to: 'projects#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

  # Default route : Try not to use
  # get ':controller(/:action(:id))'
end

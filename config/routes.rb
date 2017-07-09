Rails.application.routes.draw do
  root 'home#index'

  resources :projects, :except => [:new, :edit, :show]
  resources :contacts

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

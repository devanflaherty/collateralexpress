Rails.application.routes.draw do
  get 'home/index'
  get '/application', to: 'application#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'

  # Static Page routes
  get '/how-it-works', to: 'pages#howItWorks'
  get '/faq', to: 'pages#faq'
  get '/gallery', to: 'pages#gallery'
end

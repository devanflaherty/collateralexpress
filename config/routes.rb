Rails.application.routes.draw do
  get 'home/index'
  resources :welcome
  resources :application
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'welcome#index'

  get '/pages', to: 'pages#index'

end

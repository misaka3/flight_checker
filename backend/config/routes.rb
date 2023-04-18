Rails.application.routes.draw do
  resources :prohibited_zones
  resources :areas
  resources :task_types
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end

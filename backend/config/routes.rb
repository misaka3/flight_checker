Rails.application.routes.draw do
  resources :flights
  resources :events
  resources :prohibited_zones do
    collection do
      post 'create_obj'
    end
  end
  resources :areas
  resources :task_types
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end

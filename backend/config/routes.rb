Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"
      resources :tasks, only: %i[index create update destroy]
    end
  end
end

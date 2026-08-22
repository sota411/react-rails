module Api
  module V1
    class HealthController < ApplicationController
      def show
        render json: { status: "ok", message: "Rails API is running" }
      end
    end
  end
end

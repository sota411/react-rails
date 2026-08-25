module Api
  module V1
    class StatsController < ApplicationController
      def show
        render json: {
          all: Task.count,
          done: Task.where(done: true).count,
          active: Task.where(done: false).count,
        }
      end
    end
  end
end

# Request:
# GET /api/v1/stats
#
# Route:
# stats#show
#
# Controller:
# Taskを条件別に数える
#
# Response:
# { all: 3, done: 1, active: 2 }

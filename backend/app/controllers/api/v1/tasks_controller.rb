module Api
  module V1
    class TasksController < ApplicationController
      before_action :set_task, only: %i[update destroy]

      # GET /api/v1/tasks
      def index
        tasks = Task.order(created_at: :desc)
        render json: tasks
      end

      # POST /api/v1/tasks
      def create
        task = Task.new(task_params)

        if task.save
          render json: task, status: :created
        else
          render json: { errors: task.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/tasks/:id
      def update
        if @task.update(task_params)
          render json: @task
        else
          render json: { errors: @task.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/tasks/:id
      def destroy
        @task.destroy!
        head :no_content
      end

      private

      def set_task
        @task = Task.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :done)
      end
    end
  end
end

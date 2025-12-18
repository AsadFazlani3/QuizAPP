module Api
  module V1
    module Admin
      class BaseController < ActionController::API
        before_action :authenticate_admin!

        private

        def authenticate_admin!
          token = extract_token_from_header
          return render_unauthorized("Missing or invalid token") unless token

          payload = JwtService.decode(token)
          return render_unauthorized("Invalid token") unless payload

          @current_admin_user = AdminUser.find_by(id: payload["admin_user_id"])
          return render_unauthorized("Admin user not found") unless @current_admin_user
        end

        def extract_token_from_header
          auth_header = request.headers["Authorization"]
          return nil unless auth_header

          auth_header.split(" ").last if auth_header.start_with?("Bearer ")
        end

        def render_unauthorized(message)
          render json: { error: { message: message } }, status: :unauthorized
        end

        def render_error(message, details = {})
          render json: { error: { message: message, details: details } }, status: :unprocessable_entity
        end
      end
    end
  end
end


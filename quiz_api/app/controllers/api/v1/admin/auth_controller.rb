module Api
  module V1
    module Admin
      class AuthController < ActionController::API
        def login
          admin_user = AdminUser.find_by(email: params[:email]&.downcase)

          if admin_user&.authenticate(params[:password])
            token = JwtService.encode({ admin_user_id: admin_user.id })
            render json: {
              token: token,
              admin: ::AdminUserBlueprint.render_as_hash(admin_user)
            }, status: :ok
          else
            render json: { error: { message: "Invalid email or password" } }, status: :unauthorized
          end
        end

        def logout
          render json: { ok: true }, status: :ok
        end
      end
    end
  end
end


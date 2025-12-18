# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Build list of allowed origins
    # Default: localhost for development
    # Production: Set FRONTEND_URL env var in Render (comma-separated for multiple origins)
    # Example: FRONTEND_URL=https://your-app.pages.dev,https://yourdomain.com
    allowed_origins = ["http://localhost:5173"]
    
    if ENV["FRONTEND_URL"].present?
      allowed_origins += ENV["FRONTEND_URL"].split(",").map(&:strip).reject(&:empty?)
    end
    
    origins allowed_origins

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["Authorization"],
      credentials: false
  end
end

require 'rails_helper'

RSpec.describe "Admin Auth", type: :request do
  describe "POST /api/v1/admin/auth/login" do
    let(:admin_user) { create(:admin_user, email: "admin@example.com", password: "password123") }

    context "with valid credentials" do
      it "returns token and admin info" do
        post "/api/v1/admin/auth/login", params: { email: admin_user.email, password: "password123" }

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["token"]).to be_present
        expect(json["admin"]["email"]).to eq(admin_user.email)
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized" do
        post "/api/v1/admin/auth/login", params: { email: admin_user.email, password: "wrong" }

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["error"]["message"]).to be_present
      end
    end
  end

  describe "POST /api/v1/admin/auth/logout" do
    it "returns ok" do
      post "/api/v1/admin/auth/logout"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["ok"]).to be true
    end
  end
end


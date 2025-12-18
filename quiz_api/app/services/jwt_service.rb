class JwtService
  SECRET = ENV["JWT_SECRET"] || "dev_secret_change_me"
  ALGORITHM = "HS256"

  def self.encode(payload)
    JWT.encode(payload, SECRET, ALGORITHM)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET, true, { algorithm: ALGORITHM })
    decoded[0]
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end


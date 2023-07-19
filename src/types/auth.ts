export type Session = {
  accessToken: string;
  refreshToken: string;
};

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = Session;

export type RegisterRequest = {
  login: string;
  password: string;
  // birthDate: string; // ISO Date
};

export type RegisterResponse = Session;

export type RefreshTokenRequest = {
  refreshToken: string;
}
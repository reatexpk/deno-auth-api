export class RegistrationError extends Error {
  public constructor() {
    super("Cannot register new user");
  }
}

export class WrongCredentialsError extends Error {
  public constructor() {
    super("Wrong login or password");
  }
}

export class RefreshTokenInvalidError extends Error {
  public constructor() {
    super("Invalid refreshToken");
  }
}

export class GenericAuthError extends Error {
  public constructor() {
    super("Cannot authenticate");
  }
}

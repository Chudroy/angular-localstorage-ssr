export interface User {
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
}

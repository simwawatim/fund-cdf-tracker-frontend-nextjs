import axios from "axios";
import BASE_API_URL from "../base/base";

export type ErrorLoginResponse = {
  status: "error";
  message: string;
};
export type SuccessLoginResponse = {
  status: "success";
  token_type: string;
  access: string;
  user_id: number;
  role: string;
  constituency: number;
};

export type LoginPayload = {
  username: string;
  password: string;
};

class AuthService {
  async login(email: string, password: string): Promise<SuccessLoginResponse> {
    if (!email || !password) {
      return Promise.reject({
        status: "error",
        message: "Username and password are required",
      } as ErrorLoginResponse);
    }

    try {
      const response = await axios.post<SuccessLoginResponse>(
        `${BASE_API_URL}api/login/v1`,
        { email, password }
      );
      return response.data;
    } catch (err: any) {

      if (err.response && err.response.status === 401) {
        return Promise.reject({
          status: "error",
          message: err.response.data.message || "Invalid credentials.",
        } as ErrorLoginResponse);
      }
      return Promise.reject({
        status: "error",
        message: err.message || "Login failed.",
      } as ErrorLoginResponse);
    }
  }
}

export default new AuthService();

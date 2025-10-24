import axios from "axios";
import BASE_API_URL from "../base/base";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ProfileAPI {
  id: number;
  user: UserInfo;
  role: string;
  phone: string;
  constituency: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileSuccess {
  status: "success";
  data: ProfileAPI;
}

export interface ProfileError {
  status: "error";
  message: string | Record<string, string[]>;
}

export type MemberResponse = ProfileSuccess | ProfileError;

class ProfileService {
  async getProfileById(id: number): Promise<MemberResponse> {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/users/v1/${id}/`);
      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }
      return { status: "error", message: response.data?.message || "Failed to fetch profile" };
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      return {
        status: "error",
        message: err.response?.data?.message || "Network or server error",
      };
    }
  }

  async updateProfile(id: number, data: Partial<ProfileAPI>): Promise<MemberResponse> {
    try {
      const response = await axios.patch(`${BASE_API_URL}/api/users/update-profile/v1/14/`, data);
      if (response.data?.status === "success") {
        return { status: "success", data: response.data.data as ProfileAPI };
      }
      return { status: "error", message: response.data?.message || "Failed to update profile" };
    } catch (err: any) {
      console.error("Error updating profile:", err);

      let message = "Something went wrong while updating your profile.";

      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          message = "Please check your details — some fields may be invalid.";
        } else if (status === 401) {
          message = "You are not authorized. Please log in again.";
        } else if (status === 404) {
          message = "Profile not found.";
        } else if (status >= 500) {
          message = "The server encountered an issue. Please try again later.";
        }

        if (data?.message) {
          message += `\nDetails: ${JSON.stringify(data.message)}`;
        }
      } else if (err.request) {
        message = "No response from the server. Please check your network connection.";
      }

      return { status: "error", message };
    }
  }
}

export default new ProfileService();

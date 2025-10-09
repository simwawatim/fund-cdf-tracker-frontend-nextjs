import axios from "axios";
import BASE_API_URL from "../base/base";


export interface CommentAPI {
  id: number;
  project: number;
  user: number;
  user_name: string;
  message: string;
  parent: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CommentResponseSuccess {
  status: "success";
  data: CommentAPI | CommentAPI[];
}

export interface CommentResponseError {
  status: "error";
  message: string;
}

export type CommentResponse = CommentResponseSuccess | CommentResponseError;

class CommentService {
  private handleError(err: any, defaultMsg: string): CommentResponseError {
    let errorMessage = defaultMsg;
    if (err.response?.data?.message) {
      const msg = err.response.data.message;
      if (typeof msg === "string") errorMessage = msg;
      else if (typeof msg === "object") {
        errorMessage = Object.entries(msg)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
          .join(" | ");
      }
    }
    return { status: "error", message: errorMessage };
  }

  async createComment(project: number, user: number, message: string, parent: number | null = null): Promise<CommentResponse> {
    if (!project || !user || !message)
      return { status: "error", message: "Project, user, and message are required." };

    try {
      const response = await axios.post<CommentResponse>(
        `${BASE_API_URL}api/comments/`,
        { project, user, message, parent },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to create comment.");
    }
  }

  async getComments(projectId: number): Promise<CommentResponse> {
    if (!projectId) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<CommentResponse>(
        `${BASE_API_URL}api/comments/?project=${projectId}`
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to load comments.");
    }
  }

  async updateComment(id: number, message: string): Promise<CommentResponse> {
    if (!id || !message)
      return { status: "error", message: "Comment ID and message are required." };

    try {
      const response = await axios.patch<CommentResponse>(
        `${BASE_API_URL}api/comments/${id}/`,
        { message },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to update comment.");
    }
  }

  async deleteComment(id: number): Promise<CommentResponse> {
    if (!id) return { status: "error", message: "Comment ID is required." };
    try {
      const response = await axios.delete<CommentResponse>(
        `${BASE_API_URL}api/comments/${id}/`
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to delete comment.");
    }
  }
}

export const CommentsAPI = new CommentService();


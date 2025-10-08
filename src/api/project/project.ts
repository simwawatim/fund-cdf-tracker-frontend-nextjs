import axios from "axios";
import BASE_API_URL from "../base/base";

export interface ProjectAPI {
  id: number;
  name: string;
  constituency: number;
  program: number;
  description: string;
  allocated_budget: number;
  status: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  beneficiaries_count: number;
  project_manager: string;
  funding_source: string;
  location: string;
  remarks: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ProjectUpdateProgress {
  id: number;
  project: number;
  update_type: string;
  date: string;
  progress_percentage: number
  remarks: string;
  updated_by: number;
  is_active: boolean;
}


export interface ProjectSuccess {
  status: "success";
  data: ProjectAPI | ProjectAPI[];
  message?: string;
}

export interface ProjectError {
  status: "error";
  message: string;
}

export type ProjectResponse = ProjectSuccess | ProjectError;

export interface ProjectUpdateAPI {
  project: number; 
  update_type: "progress" | "status" | string;
  progress_percentage?: number;
  remarks?: string;
  updated_by: number;
}

export interface ProjectUpdateResponse {
  status: "success" | "error";
  data?: any;
  message?: string;
}

class ProjectService {
  private handleError(err: any, defaultMsg: string): ProjectError {
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

  async createProject(
    name: string,
    description: string,
    constituency: number,
    program: number,
    allocated_budget: number,
    start_date: string,
    end_date: string,
    beneficiaries_count: number,
    remarks: string
  ): Promise<ProjectResponse> {
    if (!name || !description || !constituency || !program || !allocated_budget || !start_date || !end_date || !remarks || !beneficiaries_count) {
      return { status: "error", message: "All fields are required" };
    }

    try {
      const response = await axios.post<ProjectSuccess>(
        `${BASE_API_URL}api/projects/v1/`,
        {
          name,
          description,
          constituency,
          program,
          allocated_budget,
          start_date,
          end_date,
          beneficiaries_count,
          remarks,
        }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to create project.");
    }
  }

  async getProjects(): Promise<ProjectResponse> {
    try {
      const response = await axios.get<ProjectSuccess>(`${BASE_API_URL}api/projects/v1/`);
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to get projects.");
    }
  }

  async getProjectById(id: number): Promise<ProjectResponse> {
    if (!id) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<ProjectSuccess>(`${BASE_API_URL}api/projects/v1/${id}/`);
      return response.data;
    } catch (err: any) {
      return this.handleError(err, `Failed to get project with ID ${id}.`);
    }
  }

  async createProjectUpdate(data: ProjectUpdateAPI): Promise<ProjectUpdateResponse> {
    if (!data.project || !data.update_type || !data.updated_by) {
      return { status: "error", message: "Project, update_type, and updated_by are required." };
    }

    try {
      const response = await axios.post<ProjectUpdateResponse>(
        `${BASE_API_URL}api/project-updates/v1/`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: `Failed to create project update: ${err.message || err}`,
      };
    }
  }


  async getProjectUpdateBasedOnProjectId(projectId: number): Promise<ProjectUpdateResponse> {
    if (!projectId) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<ProjectUpdateResponse>(
        `${BASE_API_URL}api/project-updates/v1/${projectId}/`
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: `Failed to get project updates for project ID ${projectId}: ${err.message || err}`,
      };
    }
  }

}

export default new ProjectService();

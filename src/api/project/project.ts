import axios from "axios";
import BASE_API_URL from "../base/base";
import { getAuthHeader } from "../base/token";

export interface ProjectAPI {
  id: string | number;
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
  created_by: number;
  updated_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}


export interface ProjectUpdateSupportingDocumentPayload  {
  project_id: number;
  title: string;
  doc_type: string;
  file_url: string;
  uploaded_by: number;
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
  status: "progress" | "status" | string;
  progress_percentage?: number;
  remarks?: string;
  file?: File | null;
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
    remarks: string,
    create_by: number
  ): Promise<ProjectResponse> {
    if (!name || !description || !constituency || !program || !allocated_budget || !start_date || !end_date || !remarks || !beneficiaries_count || !create_by ) {
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
          created_by: 9,
        },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to create project.");
    }
  }

  async getProjects(): Promise<ProjectResponse> {
    try {
      const response = await axios.get<ProjectSuccess>(`${BASE_API_URL}api/projects/v1/`,
        {headers: getAuthHeader()}
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, "Failed to get projects.");
    }
  }

  async getProjectById(id: number): Promise<ProjectResponse> {
    if (!id) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<ProjectSuccess>(`${BASE_API_URL}api/projects/v1/${id}/`,
           {headers: getAuthHeader()}
      );
      return response.data;
    } catch (err: any) {
      return this.handleError(err, `Failed to get project with ID ${id}.`);
    }
  }

async createProjectUpdate(data: ProjectUpdateAPI): Promise<ProjectUpdateResponse> {
  if (!data.project || !data.status || !data.updated_by) {
    return { status: "error", message: "Project, status, and updated_by are required." };
  }

  try {
    let response;
    if (data.file) {
      // Send multipart/form-data
      const formData = new FormData();
      formData.append("project", data.project.toString());
      formData.append("status", data.status);
      if (data.progress_percentage !== undefined)
        formData.append("progress_percentage", data.progress_percentage.toString());
      if (data.remarks) formData.append("remarks", data.remarks);
      formData.append("updated_by", data.updated_by.toString());
      formData.append("file", data.file);

      response = await axios.post<ProjectUpdateResponse>(
        `${BASE_API_URL}api/project-updates/v1/`,
        formData,
        { headers: { 
                      "Content-Type": "multipart/form-data",
                      ...getAuthHeader() } }
      );
    } else {
      // Send JSON if no file
      response = await axios.post<ProjectUpdateResponse>(
        `${BASE_API_URL}api/project-updates/v1/`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return response.data;
  } catch (err: any) {
    return {
      status: "error",
      message: err.response?.data?.message || err.message || "Failed to create project update.",
    };
  }
}


  async getProjectUpdateBasedOnProjectId(projectId: number): Promise<ProjectUpdateResponse> {
    if (!projectId) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<ProjectUpdateResponse>(
        `${BASE_API_URL}api/project-updates/v1/${projectId}/`,
        {headers: getAuthHeader()}
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: `Failed to get project updates for project ID ${projectId}: ${err.message || err}`,
      };
    }
  }

  async createProjectUpdateSupportingDocumentFile(file: File, project_id: number, uploaded_by: number , project_update_id: number): Promise<ProjectUpdateResponse> {
    const formData = new FormData();
    formData.append("project", project_id.toString());
    formData.append("title", `Update Document - ${new Date().toISOString()}`);
    formData.append("doc_type", "report");
    formData.append("uploaded_by", uploaded_by.toString());
    formData.append("file", file);

    try {
      const response = await axios.post<ProjectUpdateResponse>(
        `${BASE_API_URL}/api/project-documents/v1/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: err.response?.data?.message || err.message || "Failed to upload file",
      };
    }
  }

  async getProjectUpdateSupportingDocuments(projectId: number): Promise<ProjectUpdateResponse> {
    if (!projectId) return { status: "error", message: "Project ID is required." };
    try {
      const response = await axios.get<ProjectUpdateResponse>(
        `${BASE_API_URL}api/projects/${projectId}/documents/`
      );
      return response.data;
    } catch (err: any) {
      return {
        status: "error",
        message: `Failed to get supporting documents for project ID ${projectId}: ${err.message || err}`,
      };
    }
  }


}

export default new ProjectService();

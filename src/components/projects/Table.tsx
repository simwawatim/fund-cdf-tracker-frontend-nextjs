"use client";

import { useEffect, useState } from "react";
import ConstituencyService from "../../api/constituency/constituency";
import ProgramService, { ProgramAPI } from "../../api/program/program";
import ProjectService, { ProjectAPI } from "../../api/project/project";
import Swal from "sweetalert2";
import Link from "next/link";

interface Project {
  id: number;
  name: string;
  constituency: number;
  program: number;
  description: string;
  allocated_budget: number;
  status: string;
  start_date: string;
  end_date: string;
  beneficiaries_count: number;
  project_manager: string;
  funding_source: string;
  location: string;
  remarks: string;
  created_by: number;
}

interface Constituency {
  id: number;
  name: string;
}

const ProjectsTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [programType, setProgramTypes] = useState<ProgramAPI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
      case "halfway":
      case "almost_done":
        return "bg-yellow-100 text-yellow-700";
      case "planning":
        return "bg-blue-100 text-blue-700";
      case "on_hold":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const [formData, setFormData] = useState<Project>({
    id: 0,
    name: "",
    constituency: 0,
    program: 0,
    description: "",
    allocated_budget: 0,
    status: "",
    start_date: "",
    end_date: "",
    beneficiaries_count: 0,
    project_manager: "",
    funding_source: "",
    location: "",
    remarks: "",
    created_by: 9,
  });

  const handleGetConstituencies = async () => {
    try {
      const response = await ConstituencyService.getConstituencies();
      setConstituencies(response);
    } catch (error) {
      console.error("Error fetching constituencies:", error);
      Swal.fire("Error", "Failed to fetch constituencies", "error");
    }
  };

  const handleGetProjects = async () => {
    const response = await ProjectService.getProjects();
    if (response.status === "success") {
      setProjects(
        Array.isArray(response.data)
          ? (response.data as Project[])
          : [response.data as Project]
      );
    } else {
      Swal.fire("Error", response.message, "error");
    }
  };

  const handleGetPrograms = async () => {
    try {
      const response = await ProgramService.getPrograms();
      if (response.status === "success") {
        setProgramTypes(response.data as ProgramAPI[]);
      } else {
        Swal.fire("Error", response.message, "error");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      Swal.fire("Error", "Failed to fetch programs", "error");
    }
  };

  useEffect(() => {
    handleGetConstituencies();
    handleGetPrograms();
    handleGetProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      id: 0,
      name: "",
      constituency: 0,
      program: 0,
      description: "",
      allocated_budget: 0,
      status: "",
      start_date: "",
      end_date: "",
      beneficiaries_count: 0,
      project_manager: "",
      funding_source: "",
      location: "",
      remarks: "",
      created_by: 9,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const staticCreator = 9;
      if (editingProject) {
        setProjects(
          projects.map((p) => (p === editingProject ? formData : p))
        );
      } else {
        setProjects([...projects, formData]);

        const response = await ProjectService.createProject(
          formData.name,
          formData.description,
          formData.constituency,
          formData.program,
          formData.allocated_budget,
          formData.start_date,
          formData.end_date,
          formData.beneficiaries_count,
          formData.remarks,
          staticCreator
        );

        if (response.status === "success") {
          Swal.fire("Success", "Project created successfully!", "success");
        } else {
          Swal.fire(
            "Error",
            response.message || "Something went wrong",
            "error"
          );
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.log("Error creating project:", error);
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    }
  };

  // --- SEARCH FILTER ---
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    const constituencyName =
      constituencies.find((c) => c.id === p.constituency)?.name || "";
    return (
      p.name.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term) ||
      constituencyName.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Projects Table</h1>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={openAddModal}
          className="bg-green-900 text-white px-4 py-2 rounded hover:bg-black"
        >
          Add Project
        </button>

        <input
          type="text"
          placeholder="Search by name, status, or constituency"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mblockt-2  rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="text-left py-3 px-6">No</th>
              <th className="text-left py-3 px-6">Name</th>
              <th className="text-left py-3 px-6">Constituency</th>
              <th className="text-left py-3 px-6">Budget</th>
              <th className="text-left py-3 px-6">Status</th>
              <th className="text-left py-3 px-6">Start</th>
              <th className="text-left py-3 px-6">End</th>
              <th className="text-left py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 text-black px-6">{project.id}</td>
                <td className="py-3 text-black px-6">{project.name}</td>
                <td className="py-3 text-black px-6">
                  {
                    constituencies.find((c) => c.id === project.constituency)
                      ?.name || "Unknown"
                  }
                </td>

                <td className="py-3 text-black px-6">
                  {project.allocated_budget.toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-black px-6">{project.start_date}</td>
                <td className="py-3 text-black px-6">{project.end_date}</td>
                <td className="py-3 text-black px-6">
                  <Link
                    href={`/project-view/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded hover:bg-gray-300 ${
              currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-green-900 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg w-[700px] p-6 relative text-black overflow-y-auto max-h-[90vh]">
            {/* ... Modal form stays same as your existing code ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;

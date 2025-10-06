"use client";

interface ProjectDetailsProps {
  type: string;
  budget: string;
  beneficiaries: string;
  manager: string;
  source: string;
  location: string;
  remarks: string;
}

const ProjectDetails = ({
  type,
  budget,
  beneficiaries,
  manager,
  source,
  location,
  remarks,
}: ProjectDetailsProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse text-sm">
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Project Type</td>
          <td className="py-2 px-4 text-gray-900">{type}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Allocated Budget</td>
          <td className="py-2 px-4 text-gray-900">{budget}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Beneficiaries</td>
          <td className="py-2 px-4 text-gray-900">{beneficiaries}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Project Manager</td>
          <td className="py-2 px-4 text-gray-900">{manager}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Funding Source</td>
          <td className="py-2 px-4 text-gray-900">{source}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Location</td>
          <td className="py-2 px-4 text-gray-900">{location}</td>
        </tr>
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Remarks</td>
          <td className="py-2 px-4 text-gray-900">{remarks}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default ProjectDetails;

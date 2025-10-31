"use client";

interface ProjectDetailsProps {
  budget: string;
  program: string | number;
  beneficiaries: string | number;
  remarks: string | number;
}

const ProjectDetails = ({
  budget,
  program,
  beneficiaries,
  remarks,
}: ProjectDetailsProps) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse text-sm">
      <tbody className="divide-y divide-gray-200">
        <tr>
          <td className="py-2 px-4 font-medium text-gray-700">Project Type</td>
          <td className="py-2 px-4 text-gray-900">{program}</td>
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
          <td className="py-2 px-4 font-medium text-gray-700">Remarks</td>
          <td className="py-2 px-4 text-gray-900">{remarks}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default ProjectDetails;

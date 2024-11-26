import React from "react";

const RecentEnrollments = ({ enrollments }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Enrollments
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments?.map((enrollment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {enrollment.student_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {enrollment.course_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(enrollment.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEnrollments;

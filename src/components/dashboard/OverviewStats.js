import React from "react";

const OverviewStats = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Total Courses
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {overview?.total_courses}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Total Students
        </h3>
        <p className="text-3xl font-bold text-green-600">
          {overview?.total_students}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Total Lessons
        </h3>
        <p className="text-3xl font-bold text-purple-600">
          {overview?.total_lessons}
        </p>
      </div>
    </div>
  );
};

export default OverviewStats;

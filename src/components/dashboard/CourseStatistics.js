import React from "react";
import { Link } from "react-router-dom";

const CourseStatistics = ({ courses }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Course Statistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link
            key={course.id}
            to={`/instructor/courses/${course.id}`}
            className="block border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors duration-200"
          >
            <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Students: {course.total_students}
              </p>
              <p className="text-sm text-gray-600">
                Lessons: {course.total_lessons}
              </p>
              <p className="text-sm text-gray-600">
                Start Date: {new Date(course.start_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                End Date: {new Date(course.end_date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseStatistics;

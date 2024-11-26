import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InstructorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/instructor/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch dashboard data"
        );
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!selectedCourse) return;

      try {
        const response = await axios.get(
          `http://localhost:8000/api/instructor/courses/${selectedCourse}/details/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourseDetails(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch course details"
        );
      }
    };

    fetchCourseDetails();
  }, [selectedCourse, token]);

  // Transform enrollment trends data for the chart
  const transformEnrollmentTrends = (trends) => {
    return Object.entries(trends).map(([date, count]) => ({
      date,
      enrollments: count,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Courses
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData?.overview.total_courses}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData?.overview.total_students}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Lessons
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {dashboardData?.overview.total_lessons}
          </p>
        </div>
      </div>

      {/* Enrollment Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enrollment Trends
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                dashboardData
                  ? transformEnrollmentTrends(dashboardData.enrollment_trends)
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Enrollments */}
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
              {dashboardData?.recent_enrollments.map((enrollment, index) => (
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

      {/* Course Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.courses.map((course) => (
            <Link
              key={course.id}
              to={`/instructor/courses/${course.id}`}
              className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
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

      {/* Course Details Modal */}
      {selectedCourse && courseDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {courseDetails.title}
              </h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Recent Enrollments
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseDetails.recent_enrollments.map(
                      (enrollment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(enrollment.date).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;

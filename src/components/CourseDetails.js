import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import LessonForm from "./LessonForm";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user?.role);
  const [lessons, setLessons] = useState([]);
  const isInstructor = useSelector(
    (state) => state.auth.user?.user_type === "instructor"
  );
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const courseResponse = await axios.get(
          `http://localhost:8000/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(courseResponse.data);
        setLessons(courseResponse.data.lessons || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching course details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseAndLessons();
  }, [courseId, token]);

  const handleEnroll = async () => {
    try {
      setError(null);
      setSuccessMessage(null);
      await axios.post(
        `http://localhost:8000/api/courses/${courseId}/enroll/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedCourse = await axios.get(
        `http://localhost:8000/api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourse(updatedCourse.data);
      setSuccessMessage("Successfully enrolled in the course!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error enrolling in course");
    }
  };

  const handleUnenroll = async () => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      try {
        setError(null);
        setSuccessMessage(null);
        await axios.post(
          `http://localhost:8000/api/courses/${courseId}/unenroll/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedCourse = await axios.get(
          `http://localhost:8000/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(updatedCourse.data);
        setSuccessMessage("Successfully unenrolled from the course!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error unenrolling from course"
        );
      }
    }
  };

  const handleLessonCreated = (newLesson) => {
    setLessons([...lessons, newLesson]);
    setShowLessonForm(false);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
          <div className="flex items-center space-x-2 text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <p className="text-lg">Instructor: {course.instructor.username}</p>
          </div>
          <div className="mt-2 text-white opacity-90">
            <p>
              Start Date: {new Date(course.start_date).toLocaleDateString()}
            </p>
            <p>End Date: {new Date(course.end_date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Lessons Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Lessons</h2>
              {isInstructor && !showLessonForm && (
                <button
                  onClick={() => setShowLessonForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Lesson
                </button>
              )}
            </div>

            {showLessonForm && (
              <LessonForm
                courseId={courseId}
                token={token}
                onLessonCreated={handleLessonCreated}
                onCancel={() => setShowLessonForm(false)}
              />
            )}

            {lessons.length > 0 ? (
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${courseId}/lessons/${lesson.id}`}
                    className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="text-sm text-gray-500">
                        {new Date(lesson.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No lessons available yet.</p>
            )}
          </div>

          {/* Enroll Button - Only show if user is not the instructor */}
          {!isInstructor && (
            <button
              onClick={course.is_enrolled ? handleUnenroll : handleEnroll}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition duration-200 ${
                course.is_enrolled
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {course.is_enrolled ? (
                <span className="flex items-center justify-center">
                  Unenroll from Course
                </span>
              ) : (
                "Enroll Now"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

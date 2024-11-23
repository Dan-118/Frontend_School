import React from "react";

const LessonDetail = ({ lesson, isInstructor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-medium text-gray-900">{lesson.title}</h3>
        {isInstructor && (
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-4 prose max-w-none">
        <p className="text-gray-600 whitespace-pre-wrap">{lesson.content}</p>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Last updated: {new Date(lesson.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default LessonDetail;

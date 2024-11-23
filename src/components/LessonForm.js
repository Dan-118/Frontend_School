import React, { useState } from "react";
import axios from "axios";

const LessonForm = ({ courseId, token, onLessonCreated, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/api/courses/${courseId}/lessons/`,
        {
          title,
          content,
          order: 1, // You might want to calculate this based on existing lessons
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onLessonCreated(response.data);
      setTitle("");
      setContent("");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating lesson");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Create New Lesson</h3>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Lesson Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Lesson
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;

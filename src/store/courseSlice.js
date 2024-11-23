import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await axios.get("http://localhost:8000/api/courses/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enrollCourse",
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.post(
        `http://localhost:8000/api/courses/${courseId}/enroll/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to enroll in course"
      );
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    enrollmentError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.enrollmentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(enrollCourse.pending, (state) => {
        state.enrollmentError = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        const course = state.items.find(
          (course) => course.id === action.payload
        );
        if (course) {
          course.isEnrolled = true;
        }
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.enrollmentError = action.payload;
      });
  },
});

export const { clearErrors } = courseSlice.actions;

export default courseSlice.reducer;

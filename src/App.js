import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import CourseList from "./components/CourseList";
import CourseDetails from "./components/CourseDetails";
import Navigation from "./components/Navigation";
import LessonPage from "./components/LessonPage";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/courses"
            element={<PrivateRoute element={CourseList} />}
          />
          <Route
            path="/courses/:courseId"
            element={<PrivateRoute element={CourseDetails} />}
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<PrivateRoute element={LessonPage} />}
          />
          <Route path="*" element={<Navigate to="/courses" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// File: course-management-frontend/src/components/Navigation.js
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  const isInstructor = useSelector(
    (state) => state.auth.user?.user_type === "instructor"
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Course Management
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/courses" className="text-white mr-4">
                Courses
              </Link>
              {isInstructor && (
                <Link to="/instructor/dashboard" className="text-white mr-4">
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

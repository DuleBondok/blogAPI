import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Check if user is authenticated and has the "admin" role
    if (!token || role !== "admin") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default AdminRoute;
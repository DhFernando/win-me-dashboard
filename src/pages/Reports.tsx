import React from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function Reports() {
  const location = useLocation();
  useBreadCrumb("Reports", location.pathname, "Reports");

  return (
    <div className="dashboard">
      <div className="section_row"></div>
    </div>
  );
}

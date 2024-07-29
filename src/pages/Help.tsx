import React from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function Help() {
  const location = useLocation();
  useBreadCrumb("Help", location.pathname, "Help");
 
  return (
    <div className="dashboard">
      <div className="section_row"></div>
    </div>
  );
}

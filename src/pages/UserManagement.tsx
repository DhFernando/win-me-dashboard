import { Button } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import client from "../GraphQL/ApolloClient";
import "../assets/css/Dashboard.scss";
import UserDataTable from "../components/UserManagement/UserDataTable";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function UserManagement() {
  const location = useLocation();
  useBreadCrumb("User Management", location.pathname, "User Management");

  const onRefresh = () => {
    client.resetStore();
  };

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => onRefresh()}
          >
            Refresh
          </Button>
        </div>
        <UserDataTable />
      </div>
    </div>
  );
}

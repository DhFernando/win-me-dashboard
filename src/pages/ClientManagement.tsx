import { Button } from "antd";
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../assets/css/Dashboard.scss";
import ClientDataTable from "../components/ClientManagement/ClientDataTable";
import NewClientModel from "../components/ClientManagement/NewClientModel"; 
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function ClientManagement() {
  const location = useLocation();
  const [visible, setVisible] = useState<any>(false);
  useBreadCrumb("Client Management", location.pathname ,"Client Management");
  
  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add New Client
          </Button>
          <NewClientModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
          />
        </div>
        <ClientDataTable />
      </div>
    </div>
  );
}

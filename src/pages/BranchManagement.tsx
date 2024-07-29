import { Button } from "antd";
import React, { useState } from "react";
import "../assets/css/Dashboard.scss";
import AddProductModel from "../components/ProductManagement/AddProductModel";
import { useLocation } from "react-router-dom";
import BranchDataTable from "../components/BranchManagement/BranchDataTable";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function BranchManagement() {
  const location = useLocation();
  const [visible, setVisible] = useState<any>(false);
  useBreadCrumb("Branch Management", location.pathname, "Branch Management");

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add New Branch
          </Button>
          <AddProductModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
          />
        </div>
        <BranchDataTable />
      </div>
    </div>
  );
}

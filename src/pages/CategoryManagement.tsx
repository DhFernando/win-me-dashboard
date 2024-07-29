import { Button } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import CategoryDataTable from "../components/CategoryManagement/CategoryDataTable";
import NewCategoryModel from "../components/CategoryManagement/NewCategoryModel";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function CategoryManagement() {
  const location = useLocation();
  const [visible, setVisible] = useState<any>(false);
  useBreadCrumb("Category Management", location.pathname, "Category Management");

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add New Category
          </Button>
          <NewCategoryModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
            type="New"
            id={null}
          />
        </div>
        <CategoryDataTable />
      </div>
    </div>
  );
}

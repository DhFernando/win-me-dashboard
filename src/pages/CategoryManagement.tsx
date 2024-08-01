import { Button } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss"; 
import NewCategoryModel from "components/CategoryManagement/NewCategoryModel";
import { useBreadCrumb } from "hooks/useBreadCrumb";
import CategoryDataTable from "components/CategoryManagement/CategoryDataTable";

export default function CategoryManagement() {
  const location = useLocation();
  const [visible, setVisible] = useState<boolean>(false);
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

import { Button } from "antd";
import React, { useState } from "react";
import "../assets/css/Dashboard.scss";
import ProductsDataTable from "../components/ProductManagement/ProductsDataTable";
import AddProductModel from "../components/ProductManagement/AddProductModel";
import { useLocation } from "react-router-dom";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function UnitManagement() {
  const location = useLocation();
  const [visible, setVisible] = useState<any>(false);
  useBreadCrumb("Unit Management", location.pathname, "Unit Management");

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add New Product
          </Button>
          <AddProductModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
          />
        </div>
        <ProductsDataTable />
      </div>
    </div>
  );
}

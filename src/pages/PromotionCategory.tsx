import { Button } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import PromotionCategoryDataTable from "../components/PromotionManagement/PromotionCategoryDataTable";
import PromotionCategoryModel from "../components/PromotionManagement/PromotionCategoryModel";
import { useBreadCrumb } from "../hooks/useBreadCrumb";

export default function PromotionCategory() {
  const location = useLocation();

  const [visible, setVisible] = useState<any>(false);
  useBreadCrumb("Promotion Category", location.pathname,"", "add");

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => setVisible(true)}
          >
            Add New
          </Button>
          <PromotionCategoryModel
            visible={visible}
            setVisible={() => {
              setVisible(!visible);
            }}
            type="New"
            selectData={null}
          />
        </div>
        <PromotionCategoryDataTable />
      </div>
    </div>
  );
}

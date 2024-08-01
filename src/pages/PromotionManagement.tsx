import { Button } from "antd";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import NewPromotionModel from "../components/PromotionManagement/NewPromotionModel";
import PromotionDataTable from "../components/PromotionManagement/PromotionDataTable";
import PromotionDataTableBranch from "../components/PromotionManagement/PromotionDataTableBranch";
import { useBreadCrumb } from "../hooks/useBreadCrumb"; 
import { useStore } from "store/useStore";

export default function PromotionManagement() {
  const location = useLocation();

  const [visible, setVisible] = useState<boolean>(false);
  useBreadCrumb(
    "Promotion Management",
    location.pathname,
    "Promotion Management"
  );
  const profileData = useStore((state) => state.profileData);

  return (
    <div className="dashboard">
      <div className="section_row">
        {(profileData.role === "SUPER_ADMIN" ||
          profileData.role === "ADMIN") && (
          <div className="top_row">
            <Button
              type="primary"
              className="primary__btn"
              onClick={() => setVisible(true)}
            >
              Add New
            </Button>
            <NewPromotionModel
              visible={visible}
              setVisible={() => {
                setVisible(!visible);
              }}
              type="New"
            />
          </div>
        )}
        {profileData.role === "SUPER_ADMIN" || profileData.role === "ADMIN" ? (
          <PromotionDataTable />
        ) : (
          <PromotionDataTableBranch />
        )}
      </div>
    </div>
  );
}

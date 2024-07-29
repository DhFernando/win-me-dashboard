import React from "react";
import useDashBoard from "../../hooks/useDashBoard";
import DashBoardBox from "./DashBoardBox";

const DashBoardStatistic = () => {
  const dashBoard = useDashBoard(null);

  return (
    <div className="box_section">
      <DashBoardBox
        title="Clients"
        count={dashBoard.companies ? dashBoard.companies.totalCount : 0}
        icon={"bi bi-people"}
      />
      <DashBoardBox
        title="Categories"
        count={
          dashBoard.productCategories ? dashBoard.productCategories.length : 0
        }
        icon={"bi bi-ui-checks-grid"}
      />
      <DashBoardBox
        title="Products"
        count={dashBoard.products ? dashBoard.products.totalCount : 0}
        icon={"bi bi-handbag"}
      />
      <DashBoardBox
        title="Tickets"
        count={dashBoard.tickets ? dashBoard.tickets.totalCount : 0}
        icon={"bi bi-hdd-stack"}
      />
    </div>
  );
};

export default DashBoardStatistic;

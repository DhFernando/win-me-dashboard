import React, { useEffect, useState } from "react";
import useProductsList from "../../hooks/useProductsList";
import useTicketList from "../../hooks/useTicketList";
import { useStore } from "../../store";
import DashBoardBox from "./DashBoardBox";

const DashBoardStatisticBranch = () => {
  const profileData = useStore((state) => state.profileData);

  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    query: null,
    companyId: profileData.length !== 0 ? profileData?.companyBranchRoles[0]?.company.id : null,
    productCategoryId: null,
  });

  useEffect(() => {
    setFilterData({
      ...filterData,
      companyId: profileData.length !== 0 ? profileData?.companyBranchRoles[0]?.company.id : null,
    })
    // eslint-disable-next-line
  }, [profileData]);

  const productsList = useProductsList(filterData, true);

  const ticketList = useTicketList(filterData);

  return (
    <div className="box_section">
      <DashBoardBox title="Clients" count={1} icon={"bi bi-people"} />
      <DashBoardBox
        title="Categories"
        count={1}
        icon={"bi bi-ui-checks-grid"}
      />
      <DashBoardBox
        title="Products"
        count={productsList ? productsList.totalCount : 0}
        icon={"bi bi-handbag"}
      />
      <DashBoardBox
        title="Tickets"
        count={ticketList ? ticketList.totalCount : 0}
        icon={"bi bi-hdd-stack"}
      />
    </div>
  );
};

export default DashBoardStatisticBranch;

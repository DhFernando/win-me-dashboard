import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import React, { useContext, useEffect, useState } from "react";
import client from "../../GraphQL/ApolloClient";
import useTicketList from "../../hooks/useTicketList";
import { SocketContext } from "../../socket";
import { useStore } from "store/useStore";

function Notification() {
  const socket = useContext(SocketContext);
  const profileData = useStore((state) => state.profileData);

  const [filterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    productCategoryId: null,
    productRequestId: null,
    companyId: profileData?.companyBranchRoles[0]?.company.id,
    status: "PENDING_COMPANY_RESPONSE",
    fromDate: null,
    toDate: null,
  });

  const ticketList = useTicketList(filterData);

  const handleInviteAcceptedData = (data) => {
    console.log(data);
    client.refetchQueries({
      include: "active",
    });
  };

  useEffect(() => {
    if(socket){
      socket.emit("join-room", {
        type: "company",
        data: {
          companyId: profileData?.companyBranchRoles[0]?.company.id,
        },
      });
  
      socket.on("notifications", (data) => handleInviteAcceptedData(data));
    }
    // eslint-disable-next-line
  }, [socket]);

  return (
    <Badge
      size="small"
      count={ticketList?.nodes.length !== 0 ? ticketList?.totalCount : 0}
    >
      <BellOutlined />
    </Badge>
  );
}

export default Notification;

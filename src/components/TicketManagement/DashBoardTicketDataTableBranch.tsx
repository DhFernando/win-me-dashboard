import { EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import React, { useState, useEffect, useContext, useCallback } from "react";
import useTicketList from "../../hooks/useTicketList";
import moment from "moment";
import { useStore } from "../../store";
import ReplyModel from "./ReplyModel";
import SummaryTicket from "./SummaryTicket";
import { SocketContext } from "../../socket";
import client from "../../GraphQL/ApolloClient";
import { ColumnType } from "antd/lib/table";

function DashBoardTicketDataTableBranch() {
  const profileData = useStore((state) => state.profileData);
  const [visible, setVisible] = useState<any>(false);
  const [visibleSummary, setVisibleSummary] = useState<any>(false);
  const [replyTicketID, setReplyTicket] = useState<any>(false);

  const [tableDate, setTableDate] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    productCategoryId: null,
    productRequestId: null,
    companyId: profileData.length !== 0 ? profileData?.companyBranchRoles[0]?.company.id : null,
    status: "COMPLETED",
    fromDate: null,
    toDate: null,
  });

  const socket = useContext(SocketContext);

  const handleInviteAccepted = useCallback((data) => {
    console.log(data);
    client.refetchQueries({
      include: "active",
    });
  }, []);

  useEffect(() => {
    if(socket){
      socket.on("connect", () => {
        console.log("connected");
        socket.emit("join-room", {
          type: "company",
          data: {
            companyId: profileData?.companyBranchRoles[0]?.company.id,
          },
        });
      });

      socket.on("notifications", (data) => handleInviteAccepted(data));
    }
     
    return () => {
      if(socket){
        socket.off("connect");
        socket.off("notifications");
      }
      
    };
    // eslint-disable-next-line
  }, [socket]);

  const ticketList = useTicketList(filterData);

  useEffect(() => {
    setTableDate(ticketList.nodes);
  }, [ticketList]);

  const replyTicket = (ticket) => {
    setReplyTicket(ticket);
    setVisible(true);
  };

  const summaryTicket = (ticket) => {
    setReplyTicket(ticket);
    setVisibleSummary(true);
  };

  const columns: ColumnType<any>[] = [
    {
      title: "Ticket ID",
      dataIndex: "referenceId",
      sorter: (a, b) => a.referenceId.length - b.referenceId.length,
      sortDirections: ["descend", "ascend"],
      width: 200,
    },
    {
      title: "Request ID",
      render: (record) =>
        record.requestedProducts ? record.productRequest.referenceId : "NA",
      width: 200,
    },
    {
      title: "Product",
      render: (record) =>
        record.requestedProducts ? record.requestedProducts[0].name : "NA",
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Assigned to",
      render: (record) => "-",
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Received Time",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) =>
        record.createdAt
          ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a")
          : "NA",
      width: 180,
    },
    {
      title: "Replied Time",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) =>
        record.createdAt
          ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a")
          : "NA",
      width: 180,
    },
    {
      title: "Replied by",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) => "-",
      width: 180,
    },
    {
      title: "User Confirmed Time",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) => "-",
      width: 180,
    },
    {
      title: "Deal Closed Time",
      render: (record) =>
        record.productRequest
          ? moment(record.productRequest.maxUserResponseTimeExpiresAt).format(
              "YYYY-MM-DD h:mm:ss a"
            )
          : "NA",
      width: 180,
    },
    {
      title: "Deal Closed by",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      render: (record) => "-",
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        switch (status) {
          case "EXPIRED":
          case "CLOSED":
          case "CANCELLED":
          case "NO_RESPONSE":
            return (
              <Tag className="tags" color="#c73b27">
                {status}
              </Tag>
            );
          case "PENDING_COMPANY_RESPONSE":
          case "PENDING_USER_RESPONSE":
          case "PENDING_COMPANY_CONFIRMATION":
            return (
              <Tag className="tags" color="#faad14">
                {status}
              </Tag>
            );
          case "COMPLETED":
            return (
              <Tag className="tags" color="#0d8c63">
                {status}
              </Tag>
            );
          default:
            return (
              <Tag className="tags" color="#525252">
                {status}
              </Tag>
            );
        }
      },
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 220,
    },
    {
      title: "Actions",
      render: (text, record) => (
        <>
          {record.status === "PENDING_COMPANY_RESPONSE" && (
            <Button
              className="view_button"
              shape="circle"
              icon={<i className="bi bi-reply-fill" />}
              onClick={() => replyTicket(record.id)}
            />
          )}
          {(record.status === "PENDING_COMPANY_CONFIRMATION" ||
            record.status === "NO_RESPONSE" ||
            record.status === "COMPLETED") && (
            <Button
              className="view_button"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => summaryTicket(record.id)}
            />
          )}
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];
  

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableDate}
        scroll={{ x: 1300 }}
        bordered
        pagination={{
          current: filterData.page,
          pageSize: filterData.pageSize,
          total: ticketList.totalCount,
          onChange: (page, pageSize) => {
            setFilterData({
              ...filterData,
              page: page,
              pageSize: pageSize,
            });
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />
      {visible && (
        <ReplyModel
          visible={visible}
          setVisible={() => {
            setVisible(!visible);
          }}
          ticketId={replyTicketID}
          handleProductSubmit={()=>{}}
          submittedStatus={()=>{}}
        />
      )}
      {visibleSummary && (
        <SummaryTicket
          visible={visibleSummary}
          setVisibleSummary={() => {
            setVisibleSummary(!visibleSummary);
          }}
          ticketId={replyTicketID}
        />
      )}
    </>
  );
}

export default DashBoardTicketDataTableBranch;

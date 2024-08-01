import {
  LockOutlined,
  UnlockOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Modal, Table, Tag, message } from "antd";
import { useState } from "react";
import moment from "moment";
import useAllUserList, { AllUsersWithCount } from "../../hooks/useAllUserList";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import client from "../../GraphQL/ApolloClient";
import {
  ACTIVATE_USER_ACCOUNT,
  DEACTIVATE_USER_ACCOUNT,
} from "../../GraphQL/Mutations";
import { ColumnType } from 'antd/es/table';
import { GraphQLSuccess } from "types/GraphQLTypes";
import { CircularProgress } from "@mui/material";
import { User } from "types";

const { confirm } = Modal;

// interface User {
//   id: string;
//   avatarUrl?: string;
//   name: string;
//   email: string;
//   createdAt: string;
//   phone?: string;
//   companyBranchRoles?: { role: string }[];
//   verified: boolean;
// }

function UserDataTable() {
  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    role: "USER",
  });

  const allUserList = useAllUserList(filterData);

  const columns: ColumnType<User>[] = [
    {
      title: "",
      align: "center",
      render: (record) => (
        <div className="table_av">
          {record.avatarUrl ? (
            <Avatar src={record.avatarUrl} />
          ) : (
            <Avatar className="avatar_hd">{record.name.charAt(0)}</Avatar>
          )}
        </div>
      ),
      width: 50,
    },
    {
      title: "User name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
      width: 200,
    },
    {
      title: "Account Created",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        record.createdAt
          ? moment(record.createdAt).format("YYYY-MM-DD h:mm:ss a")
          : "",
      width: 180,
    },
    {
      title: "Phone Number",
      render: (record) => (record.phone ? record.phone : "NA"),
      sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "User Type",
      render: (record) =>
        record?.companyBranchRoles && record?.companyBranchRoles.length > 0 ? (
          <Tag className="tags" color="#0d8c63">
            {record?.companyBranchRoles[0]?.role}
          </Tag>
        ) : (
          <Tag className="tags" color="#0d8c63">
            USER
          </Tag>
        ),
      width: 180,
    },
    {
      title: "Status",
      render: (record) => (
        <Tag className="tags" color={record.verified ? "#0d8c63" : "#c73b27"}>
          {record.verified ? "Active" : "Inactive"}
        </Tag>
      ),
      width: 180,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          {record.verified ? (
            <Button
              className="view_button"
              shape="circle"
              icon={<LockOutlined />}
              onClick={() => statusChange(record.id, "Inactive")}
            />
          ) : (
            <Button
              className="view_button"
              shape="circle"
              icon={<UnlockOutlined />}
              onClick={() => statusChange(record.id, "Active")}
            />
          )}
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];

  const statusChange = (id: string, type: string) => {
    confirm({
      title: `Are you sure you want to ${type} this user?`,
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        if (type === "Active") {
          activateUserAccount({
            variables: {
              userId: id,
            },
          });
        } else {
          deactivateUserAccount({
            variables: {
              userId: id,
            },
          });
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [activateUserAccount] = useMutation(ACTIVATE_USER_ACCOUNT, {
    onCompleted: (data) => {
      if (data.activateUserAccount.__typename === GraphQLSuccess.UserUpdated) {
        message.success("User account activated successfully");
        Progress.hide();
        client.resetStore();
      } else {
        message.error(data.activateUserAccount.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const [deactivateUserAccount] = useMutation(DEACTIVATE_USER_ACCOUNT, {
    onCompleted: (data) => {
      if (data.deactivateUserAccount.__typename === GraphQLSuccess.UserUpdated) {
        message.success("User account deactivated successfully");
        Progress.hide();
        client.resetStore();
      } else {
        message.error(data.deactivateUserAccount.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  if(!allUserList){
    return <CircularProgress color="secondary"/>
  }
  return (
    <Table
      columns={columns}
      dataSource={(allUserList as AllUsersWithCount).nodes}
      scroll={{ x: 1000 }}
      bordered
      pagination={{
        current: filterData.page,
        pageSize: filterData.pageSize,
        total: allUserList.totalCount,
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
  );
}

export default UserDataTable;

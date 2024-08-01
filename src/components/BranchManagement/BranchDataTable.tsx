import { EditOutlined } from "@ant-design/icons";  
import { Avatar, Button, Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function BranchDataTable() {

  const history = useHistory();
 
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const columns: ColumnType<any>[] = [
    {
      title: "",
      align: "center",
      dataIndex: "logoUrl",
      render: (logoUrl) => (
        <div className="table_av">
          <Avatar src={logoUrl} />
        </div>
      ),
      width: 50,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      sorter: (a, b) => a.userId.length - b.userId.length,
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Account Created",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.location.length - b.location.length,
      sortDirections: ["descend", "ascend"],
      width: 150,
    },
    {
      title: "User Type",
      dataIndex: "userType",
      sorter: (a, b) => a.userType.length - b.userType.length,
      sortDirections: ["descend", "ascend"],
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="tags"
          color={status === "ACTIVE" ? "#0d8c63" : "#bd0000"}
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 100,
    },
    {
      title: "Action",
      render: (text, record) => (
        <Button
          className="view_button"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => history.push(`/user-management/${record.id}`)}
        />
      ),
      fixed: "right",
      width: 70,
    },
  ];

  const data = [
    {
      key: "1",
      userId: "Savings",
      createdAt: "DEV435435",
      email: "John Brown",
      phoneNumber: "20/02/22",
      location: "05.00PM",
      userType: "",
          status: "ACTIVE",
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys({ selectedRowKeys: newSelectedRowKeys });
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys({ selectedRowKeys: newSelectedRowKeys });
        },
      },
    ],
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      scroll={{ x: 1300 }}
      bordered
    />
  );
}

export default BranchDataTable;

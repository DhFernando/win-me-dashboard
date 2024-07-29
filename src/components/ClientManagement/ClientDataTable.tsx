import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Space, Table, Tag, message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_COMPANY } from "../../GraphQL/Mutations";
import useCompanyList from "../../hooks/useCompanyList";
import moment from "moment";
import Progress from "react-progress-2";
import Highlighter from "react-highlight-words";
import CompanyDefault from "../../assets/images/company-image.jpg";
import { ColumnType } from "antd/lib/table";
import { FilterDropdownProps } from "antd/lib/table/interface";

const { confirm } = Modal;

function ClientDataTable() {
  const history = useHistory();

  const [state, setState] = useState<any>({
    searchText: "",
    searchedColumn: "",
  });

  const [filterData, setFilterData] = useState({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    query: null,
    totalCount: 200
  });

  const [tableDate, setTableDate] = useState<any>([]);

  const companyList = useCompanyList(filterData);

  useEffect(() => {
    setTableDate(companyList.nodes);
  }, [companyList]);

// Updated getColumnSearchProps function
const getColumnSearchProps = (dataIndex: string) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0] as string}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setState({
              searchText: selectedKeys[0] as string,
              searchedColumn: dataIndex,
            });
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value: React.Key | boolean, record: any): boolean => {
    // Ensure value is a string
    const searchValue = value.toString().toLowerCase();
    // Check if record[dataIndex] is a string and compare it with searchValue
    return record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(searchValue)
      : false;
  },
  onFilterDropdownVisibleChange: (visible: boolean) => {
    if (visible) {
      // Optionally focus the input
    }
  },
  render: (text: string) =>
    state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[state.searchText]}
        autoEscape
        textToHighlight={text || ""}
      />
    ) : (
      text
    ),
});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const columns:ColumnType<any>[] = [
    {
      title: "",
      align: "center",
      dataIndex: "logoUrl",
      render: (logoUrl) => (
        <div className="table_av">
          <Avatar src={logoUrl || CompanyDefault} />
        </div>
      ),
      width: 50,
    },
    {
      title: "Client Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Renewal Date",
      dataIndex: "subscriptionExpiresAt",
      sorter: (a, b) =>
        a.subscriptionExpiresAt.length - b.subscriptionExpiresAt.length,
      sortDirections: ["descend", "ascend"],
      render: (subscriptionExpiresAt) => (
        <>
          {
            <p>
              {moment(subscriptionExpiresAt).format("YYYY-MM-DD h:mm:ss a")}
            </p>
          }
        </>
      ),
      width: 180,
    },
    {
      title: "Categories",
      dataIndex: "category",
      sorter: (a, b) => a.category.name.length - b.category.name.length,
      sortDirections: ["descend", "ascend"],
      render: (category) => <>{<p>{category.name}</p>}</>,

      width: 150,
    },
    {
      title: "Products",
      dataIndex: "products",
      sorter: (a, b) => a.phone.length - b.phone.length,
      sortDirections: ["descend", "ascend"],
      render: (products) => <>{<p>{products.totalCount}</p>}</>,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <>
          {
            <Tag
              className="tags"
              color={status === "ACTIVE" ? "#0d8c63" : "#bd0000"}
            >
              {status}
            </Tag>
          }
        </>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 100,
    },
    {
      title: "Action",
      render: (text, record) => (
        <>
          <Button
            className="edit_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() =>
              history.push(`/client-management/edit-client/${record.id}`)
            }
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          />
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];

  const [updateProduct] = useMutation(UPDATE_COMPANY, {
    onCompleted: (data) => {
      if (data.updateCompany.__typename === "CompanyUpdated") {
        message.success("Category deleted successfully");
        Progress.hide();
      } else {
        message.error(data.updateCompany.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure delete this Client?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const fullRecord = companyList.nodes.find(
          (item) => item.id === record.id
        );

        updateProduct({
          variables: {
            ...fullRecord,
            active: false,
          },
        })
          .then(() => {
            setTableDate((prev) =>
              prev.map((item) =>
                item.id === record.id ? { ...item, active: false } : item
              )
            );
          })
          .catch((error) => {
            console.error("Error updating product category", error);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <Table
      columns={columns}
      dataSource={tableDate?.filter((item) => item.active)}
      scroll={{ x: 1300 }}
      bordered
      pagination={{
        current: filterData.page,
        pageSize: filterData.pageSize,
        total: filterData.totalCount,
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

export default ClientDataTable;

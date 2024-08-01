import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Space, Table, Tag, message } from "antd";
import React, { useState } from "react";
import Highlighter from "react-highlight-words";
import { useHistory } from "react-router-dom"; 
import useProductsList from "../../hooks/useProductsList";
import ViewProductModel from "./ViewProductModel";
import { useMutation } from "@apollo/client";
import { DELETE_PRODUCT } from "../../GraphQL/Mutations";
import Progress from "react-progress-2";
import Logo from "../../assets/images/logo.png";
import { ColumnType } from "antd/lib/table";
import { FilterDropdownProps } from "antd/lib/table/interface";
import { useStore } from "store/useStore";
import { useRefreshDataTables } from "store/refreshDataTables";
import { GraphQLSuccess } from "types/GraphQLTypes";

const { confirm } = Modal;

function ProductsDataTable() {
  const history = useHistory();
  const refreshDataTables = useRefreshDataTables(
    (state) => state.refreshDataTables
  );
  const [viewModel, setViewModel] = useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<boolean>(false);
  const profileData = useStore((state) => state.profileData);
  const [state, setState] = useState<any>({
    searchText: "",
    searchedColumn: "",
  });

  const setRefreshDataTables = useRefreshDataTables(
    (state) => state.setRefreshDataTables
  );

  const [filterData, setFilterData] = useState<any>({
    page: 1,
    pageSize: 10,
    order: "DESC",
    sortBy: "CREATED_AT",
    query: null,
    companyId: profileData?.companyBranchRoles[0]?.company.id,
    productCategoryId: null,
  });

  const productsList = useProductsList(filterData, refreshDataTables);

  
const getColumnSearchProps = (dataIndex: string) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
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
  onFilter: (value: React.Key | boolean, record: any) => {
    const searchValue = value.toString().toLowerCase();
    return record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(searchValue)
      : false;
  },
  onFilterDropdownVisibleChange: (visible: boolean) => {
    if (visible) {
      // setTimeout(() => this.searchInput.select(), 100);
    }
  },
  render: (text: string) =>
    state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
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

  const columns: ColumnType<any>[] = [
    {
      title: "",
      align: "center",
      dataIndex: "iconUrl",
      render: (iconUrl) => (
        <div className="table_av">
          <Avatar src={iconUrl || Logo} />
        </div>
      ),
      width: 50,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      sorter: (a, b) => a.description.length - b.description.length,
      sortDirections: ["descend", "ascend"],
      ellipsis: true,
    },
    {
      title: "Product Categories",
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
      render: (record) => record.category.name,
    },
    {
      title: "Requests",
      dataIndex: "requests",
    },
    {
      title: "Closed Deals",
      dataIndex: "closedDeals",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="tags"
          color={status === "ACTIVE" ? "#0d8c63" : "#bd0000"}
          key={status}
        >
          {status === "ACTIVE" ? "Active" : "Inactive"}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend", "ascend"],
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            className="edit_button"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => {
              openViewModel(record.id);
            }}
          />
          &nbsp;&nbsp;
          <Button
            className="edit_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() =>
              history.push(`/product-management/edit-product/${record.id}`)
            }
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </>
      ),
      fixed: "right",
      width: 130,
    },
  ];

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this Product?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteProduct({
          variables: {
            id: id,
          },
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const openViewModel = (id) => {
    if (id) {
      setViewModel(true);
      setSelectedID(id);
    }
  };

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: (data) => {
      if (data.deleteProduct.__typename === GraphQLSuccess.ProductDeleted) {
        message.success("Product Deleted Successfully");
        setRefreshDataTables(!refreshDataTables);
        Progress.hide();
      } else {
        message.error(data.deleteProduct.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <Table
        columns={columns}
        dataSource={productsList.nodes}
        scroll={{ x: 1200 }}
        pagination={{
          current: filterData.page,
          pageSize: filterData.pageSize,
          total: productsList.totalCount,
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
      {viewModel && (
        <ViewProductModel
          viewModel={viewModel}
          setViewModel={() => {
            setViewModel(!viewModel);
          }}
          selectedID={selectedID}
        />
      )}
    </>
  );
}

export default ProductsDataTable;

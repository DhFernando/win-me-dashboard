import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useCallback, useEffect, useState } from "react"; 
import AddFieldsModel from "./AddFieldsModel";
import { ColumnType } from "antd/lib/table";
import { useResponseDataTableStore } from "store/responseDataTableStore";

const { confirm } = Modal;
 
export type TableDataColumnType = {
  fields: {
    name: string;
    description: string;
    fieldType: string;
    required: boolean;
  }
}

function AddResponseFields() {
  const [visible, setVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>({});
  const [dataList, setDataList] = useState<any>([]);
  const { responseData, setResponseDataTableStore } = useResponseDataTableStore(
    useCallback(
      (state) => ({
        responseData: state.responseData,
        setResponseDataTableStore: state.setResponseDataTableStore,
      }),
      []
    )
  );

  useEffect(() => {
    setDataList(responseData);
  }, [responseData]);


  const columns:ColumnType<TableDataColumnType>[] = [
    {
      title: "Field Name",
      dataIndex: "fields",
      key: "fields",
      render: (text) => <p>{text.name}</p>,
    },
    {
      title: "Description",
      dataIndex: "fields",
      key: "fields",
      render: (text) => <p>{text.description}</p>,
    },
    {
      title: "Type",
      dataIndex: "fields",
      key: "fields",
      render: (text) => <p>{text.fieldType}</p>,
    },
    {
      title: "Required",
      dataIndex: "fields",
      key: "fields",
      render: (text) => <p>{text.required ? "Yes" : "No"}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <>
          <Button
            className="edit_button"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => showEditModel(record, index)}
          />
          &nbsp;&nbsp;
          <Button
            className="delete_button"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(index)}
          />
        </>
      ),
      fixed: "right",
      width: 100,
    },
  ];

  const showDeleteConfirm = (index) => {
    confirm({
      title: "Are you sure delete this Response Field?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        var newData = [...dataList];
        newData.splice(index, 1);
        setResponseDataTableStore(newData);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showEditModel = (record, index) => {
    console.log(index);
    setVisible(true);
    setEditData({ record, index });
  }; 

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataList}
        scroll={{ x: 800 }}
      />
       {visible && (
        <AddFieldsModel
          visible={visible}
          setVisible={() => {
            setVisible(!visible);
          }}
          modelType={"Response"}
          type="Edit"
          editData={editData}
        />
      )}
    </>
  );
}

export default AddResponseFields;

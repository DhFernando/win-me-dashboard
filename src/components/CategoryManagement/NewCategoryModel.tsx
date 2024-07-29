import { Modal } from "antd";
import React, { useEffect } from "react";
import { useImagesStore, usePostDataStore } from "../../store";
import IndustryForm from "./IndustryForm";
export default function NewCategoryModel({ visible, setVisible, type, id }) {
  const setPostData = usePostDataStore((state) => state.setPostData);
  const setImagesStore = useImagesStore((state) => state.setImagesStore);

  useEffect(() => {
    return function cleanup() {
      setPostData({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      title={type === "New" ? "Add New Category" : "Add Sub Category"}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <IndustryForm
          type={type}
          typeBtn='New'
          id={id}
          setVisible={() => setVisible(false)}
        />
      </div>
    </Modal>
  );
}

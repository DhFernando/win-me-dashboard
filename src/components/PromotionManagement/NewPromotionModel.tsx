import { Modal } from "antd";
import React, { useEffect } from "react"; 
import PromotionForm from "./PromotionForm";
import { usePostDataStore } from "store/postDataStore";
import { useImagesStore } from "store/imagesStore";
export default function NewPromotionModel({ visible, setVisible, type }) {
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
      title={"Add New Promotion"}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <PromotionForm
          type={type}
          setVisible={() => setVisible(false)}
        />
      </div>
    </Modal>
  );
}

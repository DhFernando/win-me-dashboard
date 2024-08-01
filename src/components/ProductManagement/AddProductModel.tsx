import { Modal } from "antd";
import React, { useEffect } from "react"; 
import ProductForm from "./ProductForm";
import { usePostDataStore } from "store/postDataStore";
import { useImagesStore } from "store/imagesStore";
export default function AddProductModel({ visible, setVisible }) {
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
      title={"Add New Product"}
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={700}
    >
      <div className="model_body">
        <ProductForm type="New" visible={visible} setVisible={() => setVisible(false)} />
      </div>
    </Modal>
  );
}

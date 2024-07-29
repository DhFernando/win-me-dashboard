import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import useProductById from "../../hooks/useProductById";

export default function ViewProductModel({
  viewModel,
  setViewModel,
  selectedID,
}) {
  const productById = useProductById(selectedID);
  const [postData, setPostData] = useState<any>({});
  const [keyFeatures, setKeyFeatures] = useState<any>([]);

  useEffect(() => {
    if (productById) {
      setPostData(productById);
      setKeyFeatures(productById.keyFeatures ? productById.keyFeatures : []);
    }
  }, [productById]);

  return (
    <Modal
      centered
      visible={viewModel}
      onCancel={() => setViewModel(false)}
      footer={null}
      width={800}
      className="view-product-model"
    >
      <div className="view_model">
        <img src={postData.coverUrl} alt="" />
        <div className="view_model_content">
          <div className="view_model_head">
            <img src={postData.iconUrl} alt="logo" />
            <div className="view_model_other">
              <h2>{postData ? postData.name : ""}</h2>
              <p>{postData.company ? postData.company.name : ""}</p>
            </div>
          </div>
          <div className="view_model_para">
            <h3>What is it?</h3>
            <p>{postData.description}</p>
          </div>
          <div className="view_model_para">
            <h3>Key features</h3>
            <ul>
              {keyFeatures.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}

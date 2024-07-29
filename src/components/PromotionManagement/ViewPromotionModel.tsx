import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import usePromotionById from "../../hooks/usePromotionById";

export default function ViewPromotionModel({
  viewModel,
  setViewModel,
  selectedID,
}) {
  const promotionById = usePromotionById(selectedID);
  const [postData, setPostData] = useState<any>({});
  const [keyFeatures, setKeyFeatures] = useState<any>([]);

  useEffect(() => {
    if (promotionById.length !== 0) {
      setPostData(promotionById);
      setKeyFeatures(promotionById.highlights ? promotionById.highlights : []);
    }
  }, [promotionById]);

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
        <img src={postData.bannerUrl} alt="" />
        <div className="view_model_content">
          <div className="view_model_head">
            <img
              src={postData.company ? postData.company.logoUrl : ""}
              alt="logo"
            />
            <div className="view_model_other">
              <h2>{postData.product ? postData.product.name : ""}</h2>
              <p>{postData.company ? postData.company.name : ""}</p>
            </div>
          </div>
          <div className="view_model_para">
            <h2>{postData.title}</h2>
            <p>{postData.description}</p>
          </div>
          <div className="view_model_high">
            <ul>
              {keyFeatures.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="view_model_para">
            <img src={postData ? postData.imageUrl : ""} alt="logo" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

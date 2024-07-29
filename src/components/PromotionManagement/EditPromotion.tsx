import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, message, Popconfirm } from "antd";
import PromotionForm from "./PromotionForm";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";
import usePromotionById from "../../hooks/usePromotionById";
import { useImagesStore, usePostDataStore } from "../../store";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import { UPDATE_PROMOTION } from "../../GraphQL/Mutations";

function EditPromotion(props) {
  const location = useLocation();
  const ID = props.match.params.id;
  const promotionById = usePromotionById(ID);

  useBreadCrumb("Promotion Details", location.pathname,"", "add");

  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);

  useEffect(() => {
    if (promotionById.length !== 0) {
      setPostData({
        ...postData,
        promotionId: promotionById.id,
        productId: promotionById.product.id,
        companyId: promotionById.company.id,
        description: promotionById.description,
        highlights: promotionById.highlights,
        active: promotionById.active,
        featured: promotionById.featured,
        expiresAt: promotionById.expiresAt,
        imageUrl: promotionById.imageUrl,
        bannerUrl: promotionById.bannerUrl,
        promotionCategoryIds: promotionById.promotionCategoryIds,
        title: promotionById.title,
      });
      setImagesStore({
        ...imagesStore,
        logoUrl: promotionById.imageUrl,
        bannerUrl: promotionById.bannerUrl,
      });
    }

    return function cleanup() {
      setPostData({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [promotionById]);

  const ChangeStatus = () => {
    setPostData({
      ...postData,
      active: !postData.active,
    });
  };

  const submitForm = () => {
    Progress.show();
    updatePromotion({
      variables: {
        ...postData,
      },
    });
  };

  const [updatePromotion] = useMutation(UPDATE_PROMOTION, {
    onCompleted: (data) => {
      if (data.updatePromotion.__typename === "PromotionUpdated") {
        message.success("Promotion updated successfully");
        Progress.hide();
      } else {
        message.error(data.updatePromotion.message);
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
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            className="primary__btn"
            onClick={() => submitForm()}
          >
            Save
          </Button>
        </div>
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <PromotionForm />
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                Change Promo Status |<span>Set promo status</span>
              </p>
              <Popconfirm
                title="Are you sure? You want to change the status?"
                onConfirm={ChangeStatus}
                okText="Change"
                cancelText="No"
              >
                <div
                  className={`status_bar ${
                    postData.active
                      ? "status_bar_active"
                      : "status_bar_inactive"
                  }`}
                >
                  {postData.active ? "ACTIVE" : "INACTIVE"}
                </div>
              </Popconfirm>
              <p className="sm_txt">Registered on 2020/04/20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPromotion;

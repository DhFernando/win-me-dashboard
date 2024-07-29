import React, { useEffect, useState } from "react";
import { useImagesStore, usePostDataStore } from "../../store";
import ImageUploadCover from "../Model/ImageUploadCover";
import ImageUploadProfile from "../Model/ImageUploadProfile";
// import ImageUploadModel from "../Model/ImageUploadModel";

function ImagesProductSection() {
  const [visibleModel, setVisibleModel] = useState<any>(false);
  const [visibleModelLogo, setVisibleModelLogo] = useState<any>(false);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);

  useEffect(() => {
    setPostData({
      ...postData,
      iconUrl: imagesStore.logoUrl,
      coverUrl: imagesStore.bannerUrl,
    });
    // eslint-disable-next-line
  }, [imagesStore]);

  return (
    <>
      <div className="step_header">
        <p>
          Images | <span>Industry images</span>
        </p>
      </div>
      <div className="step_two_colum">
        <div
          className="image_upload_box cover_img"
          onClick={() => setVisibleModelLogo(true)}
        >
          {imagesStore.logoUrl ? (
            <img src={`${imagesStore.logoUrl}`} alt="" />
          ) : (
            <p>Industry logo (500 x 500px)</p>
          )}
        </div>
        <div
          className="image_upload_box banner_img"
          onClick={() => setVisibleModel(true)}
        >
          {imagesStore.bannerUrl ? (
            <img src={`${imagesStore.bannerUrl}`} alt="" />
          ) : (
            <p>Industry cover (1200 x 600px)</p>
          )}
        </div>
      </div>
      {/* =============Image Upload Model============ */}
      <ImageUploadProfile
        visible={visibleModelLogo}
        setVisible={() => {
          setVisibleModelLogo(!visibleModelLogo);
        }}
        location="Industry"
      />
      <ImageUploadCover
        visible={visibleModel}
        setVisible={() => {
          setVisibleModel(!visibleModel);
        }}
        location="Industry"
      />
    </>
  );
}

export default ImagesProductSection;

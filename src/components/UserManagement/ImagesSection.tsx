import React, { useEffect, useState } from "react";
import ImageUploadCover from "../Model/ImageUploadCover";
import ImageUploadProfile from "../Model/ImageUploadProfile";
import { useStore } from "store/useStore";
import { useImagesStore } from "store/imagesStore";

function ImagesSection() {
  const [visibleModel, setVisibleModel] = useState<boolean>(false);
  const [visibleModelLogo, setVisibleModelLogo] = useState<boolean>(false);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setClientData = useStore((state) => state.setClientData);
  const clientData = useStore((state) => state.clientData);

  useEffect(() => {
    setClientData({
      ...clientData,
      logoUrl: imagesStore.logoUrl,
      bannerUrl: imagesStore.bannerUrl,
    });
    // eslint-disable-next-line
  }, [imagesStore]);

  return (
    <>
      <div className="step_header">
        <p>
          Images | <span>Company images</span>
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
            <p>Company logo (500 x 500px)</p>
          )}
        </div>
        <div
          className="image_upload_box banner_img"
          onClick={() => setVisibleModel(true)}
        >
          {imagesStore.bannerUrl ? (
            <img src={`${imagesStore.bannerUrl}`} alt="" />
          ) : (
            <p>Company cover (1200 x 600px)</p>
          )}
        </div>
      </div>
      {/* =============Image Upload Model============ */}
      <ImageUploadProfile
        visible={visibleModelLogo}
        setVisible={() => {
          setVisibleModelLogo(!visibleModelLogo);
        }}
        location="Company"
      />
      <ImageUploadCover
        visible={visibleModel}
        setVisible={() => {
          setVisibleModel(!visibleModel);
        }}
        location="Company"
      />
    </>
  );
}

export default ImagesSection;

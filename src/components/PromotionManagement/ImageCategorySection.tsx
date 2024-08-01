import React, { useEffect, useState } from "react"; 
import ImageUploadProfile from "../Model/ImageUploadProfile";
import { useImagesStore } from "store/imagesStore";
import { usePostDataStore } from "store/postDataStore";

function ImageCategorySection() {
  const [visibleModelLogo, setVisibleModelLogo] = useState<boolean>(false);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);

  useEffect(() => {
    setPostData({
      ...postData,
      iconUrl: imagesStore.logoUrl,
    });
    // eslint-disable-next-line
  }, [imagesStore]);

  return (
    <>
      <div className="step_header">
        <p>
          Images | <span>Category images</span>
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
            <p>Category icon (500 x 500px)</p>
          )}
        </div>
      </div>
      {/* =============Image Upload Model============ */}
      <ImageUploadProfile
        visible={visibleModelLogo}
        setVisible={() => {
          setVisibleModelLogo(!visibleModelLogo);
        }}
        location="PromotionCategory"
      />
    </>
  );
}

export default ImageCategorySection;

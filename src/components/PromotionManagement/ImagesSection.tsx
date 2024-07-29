import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useImagesStore, usePostDataStore } from "../../store";
import { uploadFileToS3 } from "../../util/uploadFileToS3";
import Progress from "react-progress-2";
import { message } from "antd";
import { S3config } from "../../properties";
import { Spin } from "antd";

function ImagesSection() {
  const imagesStore = useImagesStore((state) => state.imagesStore);
  const setImagesStore = useImagesStore((state) => state.setImagesStore);

  const setPostData = usePostDataStore((state) => state.setPostData);
  const postData = usePostDataStore((state) => state.postData);
  const [loading1, setLoading1] = useState<any>(false);
  const [loading2, setLoading2] = useState<any>(false);

  useEffect(() => {
    setPostData({
      ...postData,
      imageUrl: imagesStore.logoUrl,
      bannerUrl: imagesStore.bannerUrl,
    });
    // eslint-disable-next-line
  }, [imagesStore]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(e.target.files[0], "Promotion", "logoUrl");
      Progress.show();
      setLoading1(true);
    }
  };

  const onSelectFile2 = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(e.target.files[0], "Promotion", "bannerUrl");
      Progress.show();
      setLoading2(true);
    }
  };

  const onUploadFile = (imageFile, place, type) => {
    uploadFileToS3(imageFile, place).then((result: any) => {
      let responseJson = result;
      if (responseJson && responseJson.status === "success") {
        Progress.hide();
        setLoading1(false);
        setLoading2(false);
        message.success("Image uploaded successfully");
        setImagesStore({
          ...imagesStore,
          [type]: `${S3config.s3Url}/${responseJson.Key}`,
        });
      } else {
        Progress.hide();
        message.error("Error in uploading image");
      }
    });
  };

  return (
    <>
      <div className="step_header">
        <p>
          Images | <span>Promotion images</span>
        </p>
      </div>
      <div className="step_one_colum">
        {imagesStore.logoUrl ? (
          <div className="image_upload_box_full">
            <img src={`${imagesStore.logoUrl}`} alt="" />
          </div>
        ) : (
          <Spin spinning={loading1}>
            <div
              className="upload_btn_wrapper"
              style={{ height: "150px" }}
              onChange={onSelectFile}
            >
              <UploadOutlined />
              <button className="up_btn">Promotion image (600*1200px)</button>
              <input type="file" accept="image/*" />
            </div>
          </Spin>
        )}

        {imagesStore.bannerUrl ? (
          <div className="image_upload_box_full">
            <img src={`${imagesStore.bannerUrl}`} alt="" />
          </div>
        ) : (
          <Spin spinning={loading2}>
            <div
              className="upload_btn_wrapper"
              style={{ height: "150px" }}
              onChange={onSelectFile2}
            >
              <UploadOutlined />
              <button className="up_btn">Promotion banner (600*1200px)</button>
              <input type="file" accept="image/*" />
            </div>
          </Spin>
        )}
      </div>
    </>
  );
}

export default ImagesSection;

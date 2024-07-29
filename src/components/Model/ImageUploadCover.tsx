import { Modal, message } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { uploadFileToS3 } from "../../util/uploadFileToS3";
import Progress from "react-progress-2";
import { useImagesStore } from "../../store";
import {S3config} from '../../properties'

function ImageUploadCover({ visible, setVisible, location }) {
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [images, setImages] = useState<any>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);

  const rotation = 0;

  useEffect(() => {
    return function cleanup() {
      setImages("");
    };
    // eslint-disable-next-line
  }, [visible]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImages(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const submitModel = useCallback(async () => {
    Progress.show();
    try {
      const croppedImage = await getCroppedImg(
        images,
        croppedAreaPixels,
        rotation
      );
      onUploadFile(croppedImage, location);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line
  }, [croppedAreaPixels, rotation]);

  const onUploadFile = (croppedImage, place) => {
    uploadFileToS3(croppedImage, place).then((result: any) => {
      let responseJson = result;
      if (responseJson.status === 'success') {
        setVisible(false);
        setImagesStore({
          ...imagesStore,
          bannerUrl: `${S3config.s3Url}/${responseJson.Key}`,
        }); 
        Progress.hide();
        message.success("Image uploaded successfully");
      } else {
        Progress.hide();
        message.error("Error in uploading image");
      }
    });
  };

  return (
    <Modal
      title="Upload Company Cover"
      centered
      visible={visible}
      onOk={() => submitModel()}
      onCancel={() => setVisible(false)}
      width={800}
      okText="Upload Image"
    >
      <div className="up_model">
        <div className="crop-container2">
          {!images ? (
            <div className="upload_btn_wrapper" onChange={onSelectFile}>
              <UploadOutlined />
              <button className="up_btn">Choose your image</button>
              <input type="file" accept="image/*" />
            </div>
          ) : (
            <>
              <Cropper
                image={images}
                crop={crop}
                zoom={zoom}
                aspect={16 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="horizontal-cover"
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ImageUploadCover;

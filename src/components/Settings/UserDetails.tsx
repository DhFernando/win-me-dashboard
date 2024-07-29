import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input, Button, Form, message } from "antd"; 
import { useStore } from "../../store";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import { UPDATE_USER, UPDATE_USER_AVATAR } from "../../GraphQL/Mutations";
import PasswordChange from "./PasswordChange";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import SparkMD5 from "spark-md5";
import axios from "axios";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";

function UserDetails() {
  const [form] = Form.useForm();

  const location = useLocation();
  useBreadCrumb("User Details", location.pathname,"", "add");
  const profileData = useStore((state) => state.profileData);
  const setProfileData = useStore((state) => state.setProfileData);
  const [profileAvatar, setProfileAvatar] = useState<any>("");
  const [selectedImage, setSelectedImage] = useState<any>();
  const [md5Value, setMd5Value] = useState<any>();

  useEffect(() => {
    setProfileAvatar(profileData.avatarUrl);
    const FillData = () => {
      form.setFieldsValue({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
      });
    };
    FillData();
    // eslint-disable-next-line
  }, []);

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      Progress.show();
      updateUser({
        variables: {
          ...values,
          id: profileData.id,
        },
      });
    });
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data.updateUser.__typename === "UserUpdated") {
        message.success("User account updated successfully");
        setProfileData({
          ...profileData,
          firstName: data.updateUser.user.firstName,
          lastName: data.updateUser.user.lastName,
          name: data.updateUser.user.name,
        });
        Progress.hide();
      } else {
        message.error(data.updateUser.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      setSelectedImage(file);
      getMD5HashFromFile(file).then((hash) => {
        updateUserAvatar({
          variables: {
            filename: file.name,
            contentMd5: hash,
            contentType: file.type,
            userId: profileData.id,
          },
        });
      });
    } else {
      setSelectedImage(null);
      message.error("Please select an image");
    }
  };

  const uploadS3 = (presignedUrl, publicUrl) => {
    Progress.show();
    axios
      .put(presignedUrl, selectedImage, {
        headers: {
          "Content-Type": selectedImage.type,
          "Content-MD5": md5Value,
        },
      })
      .then(function (response) {
        setProfileData({ ...profileData, avatarUrl: publicUrl });
        setProfileAvatar(publicUrl);
        message.success("Image uploaded successfully");
        Progress.hide();
      })
      .catch(function (error) {
        message.error("Image upload failed");
        Progress.hide();
      });
  };

  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR, {
    onCompleted: (data) => {
      if (data.updateUserAvatar.__typename === "UserAvatarUpdated") {
        // message.success("User avatar updated successfully");
        uploadS3(
          data.updateUserAvatar.presignedUrl.presignedUrl,
          data.updateUserAvatar.presignedUrl.publicUrl
        );
        Progress.hide();
      } else {
        message.error(data.updateUserAvatar.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  function getMD5HashFromFile(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        // spark.append(e.target.result);
        const hexHash = SparkMD5.ArrayBuffer.hash(e?.target?.result, true);
        const base64Hash = btoa(hexHash);
        setMd5Value(base64Hash);
        resolve(base64Hash);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  const deleteFile = () => {
    setProfileAvatar("");
    message.success("File deleted successfully");
  };

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <p className="step_header">
                User Details |<span>Basic details about the user</span>
              </p>
              <Form
                autoComplete="off"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="firstName">
                    <Input type="text" size="large" placeholder="First Name" />
                  </Form.Item>

                  <Form.Item className="step_input" name="lastName">
                    <Input type="text" size="large" placeholder="Last Name" />
                  </Form.Item>
                </div>
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="email">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Email"
                      disabled
                    />
                  </Form.Item>

                  <Form.Item className="step_input" name="phone">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Phone no"
                      disabled
                    />
                  </Form.Item>
                </div>
                <div className="step_header">
                  <p>
                    Images | <span>User images</span>
                  </p>
                </div>
                <div className="step_two_colum">
                  {profileAvatar ? (
                    <div className="image_upload_box_avatar">
                      {/* <div className="img_rm">
                        x
                      </div> */}
                      <img src={`${profileAvatar}`} alt="" />
                      <DeleteOutlined onClick={() => deleteFile()} />
                    </div>
                  ) : (
                    <div
                      className="upload_btn_wrapper_pro"
                      onChange={onSelectFile}
                    >
                      <UploadOutlined />
                      <button className="up_btn">Choose your image</button>
                      <input type="file" accept="image/*" />
                    </div>
                  )}
                </div>
                <div className="steps-action">
                  <Button
                    type="primary"
                    className="primary__btn"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <div className="status_section">
            <PasswordChange />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;

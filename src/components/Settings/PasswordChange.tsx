import { useMutation } from "@apollo/client";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import Progress from "react-progress-2";
import { CHANGE_USER_PASSWORD } from "../../GraphQL/Mutations";
import { GraphQLSuccess } from "types/GraphQLTypes";

function PasswordChange() {
  const [form] = Form.useForm();

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const [result, setResult] = useState<any>(null);

  const onFinish = () => {
    form.validateFields().then((values) => {
      Progress.show();
      changeUserPassword({
        variables: {
          ...values,
        },
      });
    });
  };

  const [changeUserPassword] = useMutation(CHANGE_USER_PASSWORD, {
    onCompleted: (data) => {
      if (data.changeUserPassword.__typename === GraphQLSuccess.PasswordChanged) {
        message.success("Password changed successfully");
        Progress.hide();
        setResult({ result: "success" });
      } else {
        message.error(data.changeUserPassword.message);
        Progress.hide();
        setResult({ result: "error" });
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div className="status_container">
      <p className="step_header">
        Change Password |<span>Change user password</span>
      </p>
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="oldPassword"
          hasFeedback
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
          {...(result && {
            hasFeedback: true,
            help:
              result.result === "success"
                ? "Password changed successfully"
                : "Password Mismatch! Please try again",
            validateStatus: result.result === "success" ? "success" : "error",
          })}
        >
          <Input type="password" size="large" placeholder="Current Password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          hasFeedback
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input type="password" size="large" placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Password does not match!");
                }
              },
            }),
          ]}
        >
          <Input type="password" size="large" placeholder="Confirm Password" />
        </Form.Item>

        <div className="steps-action">
          <Button type="primary" className="primary__btn" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default PasswordChange;

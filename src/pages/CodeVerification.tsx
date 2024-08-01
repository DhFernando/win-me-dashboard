import Logo from "../assets/images/logo.png";
import "./../assets/css/Common.scss";
import { Button, Form, message } from "antd";
import { Input } from "antd";
import { useHistory, Link } from "react-router-dom";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client"; 
import { VERIFY_PASSWORD_RESET_REQUEST_OTP } from "GraphQL/Mutations";
import { GraphQLSuccess } from "types/GraphQLTypes";

export default function CodeVerification(props) {
  const token = props.match.params.token;
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const userLogin = () => {
    form.validateFields().then((values) => {
      Progress.show();
      verifyPasswordResetRequestOtp({
        variables: {
          ...values,
          token,
        },
      });
    });
  };

  const [verifyPasswordResetRequestOtp] = useMutation(
    VERIFY_PASSWORD_RESET_REQUEST_OTP,
    {
      onCompleted: (data) => {
        if (
          data.verifyPasswordResetRequestOtp.__typename === GraphQLSuccess.PasswordResetRequestVerification
        ) {
          message.success("OTP verified successfully");
          history.push(
            `/reset-password/${data.verifyPasswordResetRequestOtp.sessionId}`
          );
          Progress.hide();
        } else {
          message.error(data.verifyPasswordResetRequestOtp.message);
          Progress.hide();
        }
      },
      onError: (error) => {
        message.error(error.message);
        Progress.hide();
      },
      fetchPolicy: "no-cache",
    }
  );

  return (
    <div className="outer__container">
      <div className="outer_box2">
        <div className="outer_side_full">
          <div className="outer_logo">
            <img src={Logo} alt="logo" />
            <h2>WinMe Life</h2>
          </div>
          <div className="center_content">
            <div className="login_title">
              <h1>Code Verification</h1>
              <p>Enter the verification code you received</p>
            </div>
            <Form
              autoComplete="off"
              form={form}
              onFinish={userLogin}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="otpCode"
                rules={[
                  {
                    required: true,
                    message: "Verification Code cannot be empty!",
                  },
                ]}
              >
                <Input size="large" placeholder="Verification Code" />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                className="primary__btn full_width"
                htmlType="submit"
              >
                Next
              </Button>
            </Form>
            <Link to="/login" className="link back_link">
              Back to Login
            </Link>

            {/* <p className="code_time">Resend code in 00:40</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

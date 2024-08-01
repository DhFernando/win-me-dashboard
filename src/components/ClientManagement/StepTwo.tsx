import { Input, Button, Form, message } from "antd";
import { useCallback, useEffect } from "react"; 
import NumberFormat from "react-number-format"; 
import { useStore } from "store/useStore";
import { SocialMediaType } from "types/enums";

export const StepTwo = (props) => {
  const [form] = Form.useForm();
  const { clientData, setClientData } = useStore(
    useCallback(
      (state) => ({
        clientData: state.clientData,
        setClientData: state.setClientData,
      }),
      []
    )
  );

  const prev = () => {
    props.setBackStep();
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      props.setNextStep();
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  useEffect(() => {
    const FillData = () => {
      console.log(clientData);
      form.setFieldsValue({
        hotlines1: clientData.hotlines ? clientData.hotlines[0] : "",
        hotlines2: clientData.hotlines ? clientData.hotlines[1] : "",
        phone: clientData.phone,
        website: clientData.website,
        username: clientData.username,
        facebook: clientData.socialLinks
          ? clientData.socialLinks?.find(
              (obj) => obj?.provider === SocialMediaType.FACEBOOK
            )?.link
          : "",
        twitter: clientData.socialLinks
          ? clientData.socialLinks?.find(
              (obj) => obj?.provider === SocialMediaType.TWITTER
            )?.link
          : "",
        linkedin: clientData.socialLinks
          ? clientData.socialLinks?.find(
              (obj) => obj?.provider === SocialMediaType.LINKEDIN
            )?.link
          : "",
      });
    };
    FillData();
    // eslint-disable-next-line
  }, [clientData]);

  const setSocialLinks = (event, type) => {
    let socialLinks = clientData.socialLinks ? clientData.socialLinks : [];
    const input = event.target.value;

    if (input && input !== "") {
      const existingSocial = socialLinks.find((item) => item.provider === type);
      if (existingSocial) {
        existingSocial.link = input;
      } else {
        socialLinks.push({ provider: type, link: input });
      }
    } else {
      socialLinks = socialLinks.filter((item) => item.provider !== type);
    }

    setClientData({ ...clientData, socialLinks });
  };

  const setHotlines = (event, index) => {
    let hotlinesArr = clientData.hotlines;
    var hotlines: any = [];
    if (index === 0) {
      hotlines[0] = event.target.value;
      if (hotlinesArr) {
        hotlines[0] = event.target.value;
        hotlines[1] = hotlinesArr[1];
      } else {
        hotlines[0] = event.target.value;
        hotlines[1] = "";
      }
    } else {
      if (hotlinesArr) {
        hotlines[0] = hotlinesArr[0];
        hotlines[1] = event.target.value;
      } else {
        hotlines[0] = "";
        hotlines[1] = event.target.value;
      }
    }
    setClientData({ ...clientData, hotlines: hotlines });
  };

  return (
    <div className="step_container">
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="step_header">
          <p>
            Company Details |<span>Contact details of the company</span>
          </p>
        </div>
        <div className="step_two_colum">
          <Form.Item className="step_input" name="hotlines1">
            <NumberFormat
              className="number_input"
              format="##########"
              placeholder="Company hotline 1"
              mask="_"
              onChange={(e) => setHotlines(e, 0)}
              renderText={(formattedValue) => <div>{formattedValue}</div>}
            />
          </Form.Item>

          <Form.Item className="step_input" name="hotlines2">
            <NumberFormat
              className="number_input"
              format="##########"
              placeholder="Company hotline 2"
              mask="_"
              onChange={(e) => setHotlines(e, 1)}
              renderText={(formattedValue) => <div>{formattedValue}</div>}
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item className="step_input" name="phone">
            <NumberFormat
              className="number_input"
              format="##########"
              placeholder="Company general phone number"
              mask="_"
              onChange={(e) =>
                setClientData({ ...clientData, phone: e.target.value })
              }
              renderText={(formattedValue) => <div>{formattedValue}</div>}
            />
          </Form.Item>
          <Form.Item
            className="step_input"
            name="website"
            rules={[
              { required: false },
              { type: "url", warningOnly: true },
              { type: "string", min: 6 },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Company website"
              onChange={(e) =>
                setClientData({ ...clientData, website: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="full_width"
            name="username"
            rules={[
              { required: true, message: "Company username cannot be empty!" },
              {
                pattern: new RegExp(/^[a-z0-9_]+$/),
                message:
                  "Username cannot contain special characters and uppers case letters",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Company page user name (https://winme.life)"
              onChange={(e) =>
                setClientData({ ...clientData, username: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="step_header">
          <p>
            Social Media Details |{" "}
            <span>Social media details of the company</span>
          </p>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="facebook"
            rules={[
              { required: false, type: "url", warningOnly: true, min: 6 },
              {
                pattern:
                  /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:[a-zA-Z0-9\.]+|\?u=[\w%\-]+)/i,
                message: "Please enter a valid facebook URL!",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Facebook page url"
              onChange={(e) => setSocialLinks(e, SocialMediaType.FACEBOOK)}
            />
          </Form.Item>
          <Form.Item
            className="step_input"
            name="twitter"
            rules={[
              { required: false, type: "url", warningOnly: true, min: 6 },
              {
                pattern:
                  /(?:https?:\/\/)?(?:twitter\.com\/i\/web\/status|promoted\/|\?promoted=true|%2Fpromoted%3Dtrue)\/\d+/i,
                message: "Please enter a valid twitter URL!",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Twitter account url"
              onChange={(e) => setSocialLinks(e, SocialMediaType.TWITTER)}
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="linkedin"
            rules={[
              { required: false, type: "url", warningOnly: true, min: 6 },
              {
                pattern:
                  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in\/|company\/|feed\/|groups\/|posts\/|events\/)?[^\s\/]+/i,
                message: "Please enter a valid linkedin URL!",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Linkedin page url"
              onChange={(e) => setSocialLinks(e, SocialMediaType.LINKEDIN)}
            />
          </Form.Item>
        </div>
        {props.type === "new" && (
          <div className="steps-action">
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>

            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

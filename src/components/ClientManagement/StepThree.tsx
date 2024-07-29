import { Input, Button, Form, message } from "antd";
import React, { useCallback, useEffect } from "react";
import { DatePicker } from "antd";
import { useCompanyAdmin, useStore } from "../../store";
import moment from "moment";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import { CREATE_COMPANY, SEND_COMPANY_INVITATION } from "../../GraphQL/Mutations";
import client from "../../GraphQL/ApolloClient";

export const StepThree = (props) => {
  const [form] = Form.useForm();

  const setClientData = useStore((state) => state.setClientData);
  const clientData = useStore((state) => state.clientData);

  const { companyAdmin, setCompanyAdmin } = useCompanyAdmin(
    useCallback(
      (state) => ({
        companyAdmin: state.companyAdmin,
        setCompanyAdmin: state.setCompanyAdmin,
      }),
      []
    )
  );

  const [createCompany] = useMutation(CREATE_COMPANY, {
    onCompleted: (data) => {
      if (data.createCompany.__typename === "CompanyCreated") {
        client.refetchQueries({
          include: "active",
        });
        message.success("Company created successfully");
        message.info("Sending invitation to company admin. Please wait...", 10);
        setTimeout(() => {
          Progress.show();
          sendCompanyInvitation({
            variables: {
              ...companyAdmin,
              companyId: data.createCompany.company.id,
              companyBranchId: data.createCompany.mainBranch.id,
              active: true,
            },
            awaitRefetchQueries: true,
          });
        }, 8000);
      } else if (
        data.createCompany.__typename === "CompanyUsernameTakenError" ||
        data.createCompany.__typename === "CompanyCategoryNotFoundError" ||
        data.createCompany.__typename === "CountryNotFoundError"
      ) {
        message.error(data.createCompany.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const [sendCompanyInvitation] = useMutation(SEND_COMPANY_INVITATION, {
    onCompleted: (data) => {
      if (
        data.sendCompanyInvitation.__typename === "CompanyInvitationCreated"
      ) {
        message.success("Company invitation sent successfully");
        setClientData({});
        setCompanyAdmin({});
        props.setNextStep();
        Progress.hide();
      } else {
        message.error(data.sendCompanyInvitation.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const prev = () => {
    props.setBackStep();
  };

  const onFinish = () => {
    form.validateFields().then((values) => {
      Progress.show();
      createCompany({
        variables: {
          ...clientData,
        },
        awaitRefetchQueries: true,
      });
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  useEffect(() => {
    const FillData = () => {
      form.setFieldsValue({
        firstName: companyAdmin.firstName,
        lastName: companyAdmin.lastName,
        designation: companyAdmin.designation,
        email: companyAdmin.email,
        phone: companyAdmin.phone,
        subscriptionExpiresAt: moment(
          companyAdmin.subscriptionExpiresAt || moment().add(1, "day")
        ),
      });
    };
    FillData();
    // eslint-disable-next-line
  }, [companyAdmin]);

  const addEmail = (value) => {
    setCompanyAdmin({ ...companyAdmin, email: value });
    setClientData({ ...clientData, email: value });
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
            Company Admin Details |
            <span>Details of the admin account holder</span>
          </p>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="firstName"
            rules={[{ required: true, message: "First name cannot be empty!" }]}
          >
            <Input
              type="text"
              size="large"
              placeholder="First name"
              onChange={(e) =>
                setCompanyAdmin({ ...companyAdmin, firstName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            className="step_input"
            name="lastName"
            rules={[
              { required: true, message: "Second name cannot be empty!" },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Second name"
              onChange={(e) =>
                setCompanyAdmin({ ...companyAdmin, lastName: e.target.value })
              }
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="designation"
            rules={[
              { required: true, message: "Designation cannot be empty!" },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Designation"
              onChange={(e) =>
                setCompanyAdmin({
                  ...companyAdmin,
                  designation: e.target.value,
                })
              }
            />
          </Form.Item>
        </div>
        <div className="step_two_colum">
          <Form.Item
            className="step_input"
            name="email"
            rules={[
              { required: true, message: "Email address cannot be empty!" },
              {
                pattern: new RegExp(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                ),
                message:
                  "Please enter a valid email address (example@example.com)",
              },
            ]}
          >
            <Input
              type="email"
              size="large"
              placeholder="Email address"
              onChange={(e) => addEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            className="step_input"
            name="phone"
            rules={[
              { required: true, message: "Contact number cannot be empty!" },
              {
                pattern: new RegExp(
                  /^(\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/
                ),
                message: "Please enter a valid phone number (+947XXXXXXXX)",
              },
            ]}
          >
            <Input
              type="text"
              size="large"
              placeholder="Contact number (+94XXXXXXXXX)"
              onChange={(e) =>
                setCompanyAdmin({
                  ...companyAdmin,
                  phone: e.target.value,
                })
              }
            />
          </Form.Item>
        </div>
        <>
          <div className="step_header">
            <p>
              Account Activation Period | <span>set account renewal date</span>
            </p>
          </div>
          <div>
            <Form.Item
              name="subscriptionExpiresAt"
              rules={[
                {
                  required: true,
                  message: "Account Activation Period cannot be empty!",
                },
              ]}
            >
              <DatePicker
                className="step_input"
                size="large"
                disabledDate={(current) =>
                  current.isBefore(moment().subtract(0, "day"))
                }
                onChange={(date, dateString) =>
                  setClientData({
                    ...clientData,
                    subscriptionExpiresAt: moment(dateString).format(),
                  })
                }
              />
            </Form.Item>
          </div>
          {props.type === "new" && (
            <>
              <p className="step_sub_txt">
                Renewal reminder will be sent 15 days prior to the renewal date
              </p>
              <br />
              <p className="step_sub_txt">
                Account verification email will be sent to the company admin's
                email address once clicked 'Add'
              </p>
            </>
          )}
        </>
        {props.type === "new" && (
          <div className="steps-action">
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>

            <Button type="primary" htmlType="submit">
              Done
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

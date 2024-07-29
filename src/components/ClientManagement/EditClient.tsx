import { useMutation } from "@apollo/client";
import { Button, message, Popconfirm, Tabs } from "antd";
import React, { useCallback, useEffect } from "react";
import Progress from "react-progress-2";
import { useLocation } from "react-router-dom";
import { UPDATE_COMPANY } from "../../GraphQL/Mutations";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";
import useCompanyById from "../../hooks/useCompanyById";
import { useCompanyAdmin, useImagesStore, useStore } from "../../store";
import ImagesSection from "./ImagesSection";
import { StepOne } from "./StepOne";
import { StepThree } from "./StepThree";
import { StepTwo } from "./StepTwo";

function EditClient(props) {
  const location = useLocation();
  const { TabPane } = Tabs;
  const ID = props.match.params.id;
  const company = useCompanyById(ID);

  const setImagesStore = useImagesStore((state) => state.setImagesStore);
  const imagesStore = useImagesStore((state) => state.imagesStore);
  useBreadCrumb("Edit Client", location.pathname, "", "add");

  const { clientData, setClientData } = useStore(
    useCallback(
      (state) => ({
        clientData: state.clientData,
        setClientData: state.setClientData,
      }),
      []
    )
  );
  const { companyAdmin, setCompanyAdmin } = useCompanyAdmin(
    useCallback(
      (state) => ({
        companyAdmin: state.companyAdmin,
        setCompanyAdmin: state.setCompanyAdmin,
      }),
      []
    )
  );

  const [updateCompany] = useMutation(UPDATE_COMPANY, {
    onCompleted: (data) => {
      if (data.updateCompany.__typename === "CompanyUpdated") {
        message.success("Company updated successfully");
        // setClientData(data.updateCompany.company);
        Progress.hide();
      } else {
        message.error(data.updateCompany.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const setValues = () => {
      if (company.length !== 0) {
        setClientData({
          ...clientData,
          id: company.id,
          companyCategoryId: company.category.id,
          rating: company.rating,
          name: company.name,
          countryId: company.country.id,
          description: company.description,
          address: company.address,
          location: company.location,
          hotlines: company.hotlines ? company.hotlines : "",
          phone: company.phone,
          website: company.website,
          username: company.username,
          socialLinks: company.socialLinks ? company.socialLinks : [],
          email: company.email,
          status: company.status,
          logoUrl: company.logoUrl,
          bannerUrl: company.bannerUrl,
        });
        setCompanyAdmin({
          ...companyAdmin,
          email: company.email,
          phone: company.phone,
          subscriptionExpiresAt: company.subscriptionExpiresAt,
        });
        setImagesStore({
          ...imagesStore,
          logoUrl: company.logoUrl,
          bannerUrl: company.bannerUrl,
        });
      }
    };
    setValues();

    return function cleanup() {
      setClientData({});
      setCompanyAdmin({});
      setImagesStore({
        logoUrl: "",
        bannerUrl: "",
      });
    };
    // eslint-disable-next-line
  }, [company]);

  const submitForm = () => {
    Progress.show();

    clientData.socialLinks = clientData.socialLinks?.filter(
      (obj) => obj.link && obj.link !== ""
    );
    updateCompany({
      variables: {
        ...clientData,
      },
      awaitRefetchQueries: true,
    });
  };

  const ChangeStatus = () => {
    setClientData({
      ...clientData,
      status: clientData.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
    });
  };

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button
            type="primary"
            onClick={() => submitForm()}
            className="primary__btn"
          >
            Save
          </Button>
        </div>
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Company Details" key="1">
                  <StepOne type={"edit"} />
                </TabPane>
                <TabPane tab="Images" key="2">
                  <ImagesSection />
                </TabPane>
                <TabPane tab="Contact Details" key="3">
                  <StepTwo type={"edit"} />
                </TabPane>
                <TabPane tab="Company Admin Details" key="4">
                  <StepThree type={"edit"} />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                Change Account Status |<span>Set account status</span>
              </p>
              <Popconfirm
                title="Are you sure? You want to change the status?"
                onConfirm={ChangeStatus}
                okText="Change"
                cancelText="No"
              >
                <div
                  className={`status_bar ${
                    clientData.status === "ACTIVE"
                      ? "status_bar_active"
                      : "status_bar_inactive"
                  }`}
                >
                  {clientData ? clientData.status : ""}
                </div>
              </Popconfirm>

              {/* <p className="step_header" style={{ marginTop: "30px" }}>
                Change Activation Period |<span>Set account renewal date</span>
              </p>
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
                  size="large"
                  className="full_width"
                  disabledDate={(current) =>
                    current.isBefore(moment().subtract(1, "day"))
                  }
                  onChange={(e, dateString) =>
                    setClientData({
                      ...clientData,
                      subscriptionExpiresAt: moment(dateString).format(),
                    })
                  }
                />
              </Form.Item>
              <p className="step_sub_txt" style={{ marginTop: "5px" }}>
                Renewal reminder well be send 15 days prior to the renewal date
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditClient;

import { Input, Button, Form } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import client from "../../GraphQL/ApolloClient";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";
import useTicketById from "../../hooks/useTicketById"; 
import RequestDetails from "./RequestDetails";
import TicketDataTable from "./TicketDataTable";
import TicketDataTableBranch from "./TicketDataTableBranch";
import { useStore } from "store/useStore";

interface Ticket {
  referenceId: string;
  productRequest: {
    productCategory: {
      name: string;
    };
    user: {
      firstName: string;
      phone: string;
    };
    tickets: {
      nodes: any[];
    };
    maxUserResponseTimeExpiresAt: string;
  };
  createdAt: string;
  status: string;
}

const ViewTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get ticket ID from route params
  const location = useLocation();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [reFresh, setReFresh] = useState<boolean>(false);

  useBreadCrumb("View Ticket", location.pathname, "", "add");
  const ticketById = useTicketById(id);
  const profileData = useStore((state) => state.profileData);

  useEffect(() => {
    const FillData = () => {
      if (ticketById) {
        form.setFieldsValue({
          ticketID: ticketById.referenceId,
          ticketName: ticketById.productRequest.productCategory.name,
          userName: ticketById.productRequest.user.firstName,
          contact: ticketById.productRequest.user.phone,
          requestCount: ticketById.productRequest.tickets.nodes.length,
          createdDate: moment(ticketById.createdAt).format("YYYY-MM-DD h:mm:ss a"),
          winner: ticketById.productRequest.user.firstName,
          closedDate: moment(ticketById.productRequest.maxUserResponseTimeExpiresAt).format("YYYY-MM-DD h:mm:ss a"),
        });
      }
    };

    FillData();
    // eslint-disable-next-line
  }, [ticketById, reFresh]);

  const RemainingTime: React.FC = () => {
    if (ticketById) {
      const time = moment(ticketById.productRequest.maxUserResponseTimeExpiresAt).diff(moment(), "seconds");
      return <div>{time > 0 ? moment.utc(time * 1000).format("HH:mm:ss") + " remaining" : "00:00:00 remaining"}</div>;
    }
    return <div>00:00:00 remaining</div>;
  };

  const StatusBar: React.FC = () => {
    if (ticketById) {
      switch (ticketById.status) {
        case "EXPIRED":
        case "CLOSED":
        case "CANCELLED":
        case "NO_RESPONSE":
          return <div className="status_bar status_bar_inactive">{ticketById.status}</div>;
        case "PENDING_COMPANY_RESPONSE":
        case "PENDING_USER_RESPONSE":
        case "PENDING_COMPANY_CONFIRMATION":
          return <div className="status_bar status_bar_pending">{ticketById.status}</div>;
        case "COMPLETED":
          return <div className="status_bar status_bar_active">{ticketById.status}</div>;
        default:
          return <div className="status_bar status_bar_default">{ticketById.status}</div>;
      }
    }
    return null;
  };

  const onRefreshData = useCallback(() => {
    client.refetchQueries({ include: "active" });
    setReFresh(!reFresh);
  }, [reFresh]);

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button type="primary" className="primary__btn" onClick={onRefreshData}>
            Refresh
          </Button>
        </div>
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <p className="step_header">
                Ticket Details |<span>Details about the ticket</span>
              </p>
              <Form autoComplete="off" form={form}>
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="ticketID">
                    <Input type="text" size="large" placeholder="Ticket ID" />
                  </Form.Item>
                  <Form.Item className="step_input" name="ticketName">
                    <Input type="text" size="large" placeholder="Ticket name" />
                  </Form.Item>
                </div>
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="userName">
                    <Input type="text" size="large" placeholder="User Name" />
                  </Form.Item>
                  <Form.Item className="step_input" name="contact">
                    <Input type="text" size="large" placeholder="Contact No" />
                  </Form.Item>
                </div>
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="requestCount">
                    <Input type="text" size="large" placeholder="Request Count" />
                  </Form.Item>
                  <Form.Item className="step_input" name="createdDate">
                    <Input type="text" size="large" placeholder="Date and Time" />
                  </Form.Item>
                </div>
                <div className="step_two_colum">
                  <Form.Item className="step_input" name="winner">
                    <Input type="text" size="large" placeholder="Deal Winner" />
                  </Form.Item>
                  <Form.Item className="step_input" name="closedDate">
                    <Input type="text" size="large" placeholder="Deal closed time" />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                Ticket Status |<span>Force change ticket status</span>
              </p>
              <StatusBar />
              <p className="remaining_time">
                <RemainingTime />
              </p>
              <p className="step_header">
                View Details |<span>View ticket details</span>
              </p>
              <Button type="primary" className="primary__btn_clr1" onClick={() => setVisible(true)}>
                REQUEST DETAILS
              </Button>
              &nbsp;&nbsp;
              <Button type="primary" className="primary__btn">
                HOLD REQUEST
              </Button>
            </div>
          </div>
        </div>
        <div className="section_box">
          <p className="step_header">
            Requests |<span>Total Request Count</span>
          </p>
          {profileData.role === "SUPER_ADMIN" || profileData.role === "ADMIN" ? (
            <TicketDataTable />
          ) : (
            <TicketDataTableBranch />
          )}
        </div>
      </div>
      {visible && (
        <RequestDetails
          visible={visible}
          setVisible={() => setVisible(!visible)}
          formData={ticketById}
        />
      )}
    </div>
  );
};

export default ViewTicket;

import React from "react";
import { useLocation } from "react-router-dom";
import { Input, Button, Form } from "antd";
import ImagesSection from "./ImagesSection";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";

function EditUser() {
  const location = useLocation();
  useBreadCrumb("User Details", location.pathname,"", "add");
  
  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button type="primary" className="primary__btn">
            Save
          </Button>
        </div>
        <div className="bottom_row">
          <div className="edit_section">
            <div className="edit_container">
              <p className="step_header">
                User Details |<span>Basic details about the user</span>
              </p>
              <div className="step_two_colum">
                <Form.Item className="step_input" name="ticketID">
                  <Input type="text" size="large" placeholder="Ticket ID" />
                </Form.Item>

                <Form.Item className="step_input" name="ticketName">
                  <Input type="text" size="large" placeholder="Ticket name" />
                </Form.Item>
              </div>
              <div className="step_two_colum">
                <Form.Item className="step_input" name="companyCategoryId">
                  <Input type="text" size="large" placeholder="User Name" />
                </Form.Item>

                <Form.Item className="step_input" name="rating">
                  <Input type="text" size="large" placeholder="Contact No" />
                </Form.Item>
              </div>
              <div className="step_two_colum">
                <Form.Item className="step_input" name="companyCategoryId">
                  <Input type="text" size="large" placeholder="Request Count" />
                </Form.Item>

                <Form.Item className="step_input" name="rating">
                  <Input type="text" size="large" placeholder="Date and Time" />
                </Form.Item>
              </div>
              <ImagesSection />
            </div>
          </div>
          <div className="status_section">
            <div className="status_container">
              <p className="step_header">
                User Status |<span>Set user status</span>
              </p>
              <div className="status_bar status_bar_active">Active</div>
              <p className="sm_txt">Registered on 2020/04/20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;

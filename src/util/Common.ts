import { message } from "antd";

export const ErrorHandle = (error) => {
  if (error.response) {
    message.error(error.response.data.message);
  } else {
    message.error(error.message);
  }
};

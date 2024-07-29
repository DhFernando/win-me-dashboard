import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { TICKET } from "../GraphQL/Queries";

function useTicketById(Id) {
  const { loading, error, data } = useQuery(TICKET, {
    variables: {
      id: Id,
    },
    fetchPolicy: "no-cache",
  });
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    const getData = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        setState(data.ticket);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useTicketById;

import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { COMPANY } from "../GraphQL/Queries";

function useCompanyById(Id) {
  const { loading, error, data } = useQuery(COMPANY, {
    variables: {
      id: Id,
    },
    fetchPolicy: "no-cache",
  });
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    const getCountry = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        setState(data.company);
        Progress.hide();
      }
    };
    getCountry();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useCompanyById;

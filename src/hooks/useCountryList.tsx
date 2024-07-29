import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { COUNTRY_LIST } from "../GraphQL/Queries";

function useCountryList() {
  const { loading, error, data } = useQuery(COUNTRY_LIST, {
    fetchPolicy: "no-cache",
  });
  const [state, setState] = useState<any>([]);

  useEffect(() => {
    const getCountryList = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        setState(data.countries);
        Progress.hide();
      }
    };
    getCountryList();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useCountryList;

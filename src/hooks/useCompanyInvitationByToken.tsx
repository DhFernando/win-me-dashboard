import { useQuery } from "@apollo/client";
import { message } from "antd";
import { useEffect, useState } from "react";
import Progress from "react-progress-2";
import { COMPANY_INVITATION_BY_TOKEN } from "../GraphQL/Queries";

function useCompanyInvitationByToken(token) {
  const { loading, error, data } = useQuery(COMPANY_INVITATION_BY_TOKEN, {
    variables: {
      token: token,
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
        setState(data.companyInvitationByToken);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line
  }, [data]);

  return state;
}

export default useCompanyInvitationByToken;

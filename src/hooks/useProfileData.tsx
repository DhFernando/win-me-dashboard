import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ME } from "../GraphQL/Queries";
import Progress from "react-progress-2";
import { message } from "antd";

interface UseProfileDataProps {
  isLogged: boolean;
}

function useProfileData({ isLogged }: UseProfileDataProps) {
  const [state, setState] = useState<any>([]);
  const { loading, error, data } = useQuery(ME, {
    variables: {
      isLogged,
    },
  });

  useEffect(() => {
    const getData = () => {
      if (loading) {
        Progress.show();
      }
      if (error) {
        message.error(error.message);
      }
      if (data) {
        console.log(data);
        setState(data.me);
        Progress.hide();
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, data]);

  return state;
}

export default useProfileData;

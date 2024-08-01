import { Button } from "antd";
import { useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import client from "../GraphQL/ApolloClient"; 
import { useBreadCrumb } from "../hooks/useBreadCrumb";
import { useStore } from "store/useStore";
import { UserRole } from "types/enums";
import TicketDataTable from "components/TicketManagement/TicketDataTable";
import TicketDataTableBranch from "components/TicketManagement/TicketDataTableBranch";

export default function TicketManagement() {
  const location = useLocation();
  useBreadCrumb("Ticket Management", location.pathname, "Ticket Management");
  const profileData = useStore((state) => state.profileData);

  const onRefresh = () => {
    client.refetchQueries({
      include: "active",
    });
  };

  return (
    <div className="dashboard">
      <div className="section_row">
        <div className="top_row">
          <Button type="primary" className="primary__btn" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
        {profileData.role === UserRole.SUPER_ADMIN || profileData.role === "ADMIN" ? (
          <TicketDataTable />
        ) : (
          <TicketDataTableBranch />
        )}
      </div>
    </div>
  );
}

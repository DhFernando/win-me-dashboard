import React, { useEffect } from "react";
import "../assets/css/Dashboard.scss";
import useProfileData from "../hooks/useProfileData";
import { useStore } from "../store";
import { useLocation } from "react-router-dom";
import { useBreadCrumb } from "../hooks/useBreadCrumb";
import Chart from "react-apexcharts";
import DashBoardTicketDataTable from "../components/TicketManagement/DashBoardTicketDataTable";
import DashBoardStatistic from "../components/DashBoardWidgets/DashBoardStatistic";
import DashBoardStatisticBranch from "../components/DashBoardWidgets/DashBoardStatisticBranch";
import DashBoardTicketDataTableBranch from "../components/TicketManagement/DashBoardTicketDataTableBranch";
import { ApexOptions } from "apexcharts";

const chartOptions: ApexOptions = {
  series: [
    {
      name: "Online Customers",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
    },
    {
      name: "Store Customers",
      data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10],
    },
  ],
  colors: ["#6ab04c", "#2980b9"],
  chart: {
    background: "transparent",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
    ],
  },
  legend: {
    position: "top",
  },
  grid: {
    show: false,
  },
};

function Dashboard() {
  const location = useLocation();
  const setProfileData = useStore((state) => state.setProfileData);
  useBreadCrumb("Dashboard", location.pathname, "Dashboard");

  const loggedData = useProfileData({isLogged: true});

  useEffect(() => {
    setProfileData(loggedData);
    // eslint-disable-next-line
  }, [loggedData]);

  return (
    <div className="dashboard">
      {loggedData.length !== 0 && (
        <>
          {loggedData.role === "SUPER_ADMIN" && <DashBoardStatistic />}
          {loggedData.role === "USER" && <DashBoardStatisticBranch />}
        </>
      )}
      <div className="section_row_chart">
        <Chart
          options={chartOptions}
          series={chartOptions.series}
          type="line"
          height="100%"
        />
      </div>
      <div className="section_row">
        <h1 className="section_title">Confirmed Tickets</h1>
        {loggedData.length !== 0 && (
          <>
            {loggedData.role === "SUPER_ADMIN" && <DashBoardTicketDataTable />}
            {loggedData.role === "USER" && <DashBoardTicketDataTableBranch />}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

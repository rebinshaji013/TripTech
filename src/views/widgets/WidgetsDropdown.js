import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { 
  cilClipboard,
  cilCarAlt,
  cilUser,
  cilPeople,
  cilSettings,
  cilColumns,
  cilTouchApp,
  cilInput, } from "@coreui/icons";

const Dashboard = ({ className }) => {
  const navigate = useNavigate();
  const widgetRefs = useRef([]);

  const [stats, setStats] = useState({
    totalTrips: 0,
    activeVehicles: 0,
    availableDrivers: 0,
    coordinators: 0,
    pendingTrips: 0,
    completedThisMonth: 0,
    operationsTeam: 0,
    totalDrivers: 0,
  });

  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    const storedDrivers = JSON.parse(localStorage.getItem("drivers")) || [];
    const storedTripCoordinators = JSON.parse(localStorage.getItem("coordinators")) || [];
    const storedOpsTeam = JSON.parse(localStorage.getItem("operations")) || [];
    const storedDriverLogin = JSON.parse(localStorage.getItem("driverLogins")) || [];

    const currentMonth = new Date().getMonth();
    const completedThisMonth = storedTrips.filter(
      (t) => t.status === "Completed" && new Date(t.date).getMonth() === currentMonth
    ).length;

    setStats({
      totalTrips: storedTrips.length,
      activeVehicles: storedVehicles.filter((v) => v.status === "Active").length,
      availableDrivers: storedDrivers.filter((d) => !d.assignedTrip).length,
      coordinators: storedTripCoordinators.length,
      pendingTrips: storedTrips.filter((t) => t.status === "Pending").length,
      completedThisMonth,
      operationsTeam: storedOpsTeam.length,
      totalDrivers: storedDriverLogin.length,
    });
  }, []);

  const cards = [
    { title: "Total Trips", value: stats.totalTrips, color: "primary", icon: cilClipboard, path: "/trips" },
    { title: "Active Vehicles", value: stats.activeVehicles, color: "info", icon: cilCarAlt, path: "/vehicles" },
    { title: "Available Drivers", value: stats.availableDrivers, color: "success", icon: cilUser, path: "/drivers" },
    { title: "Trip Coordinators", value: stats.coordinators, color: "warning", icon: cilColumns, path: "/coordinators" },
    { title: "Pending Trips", value: stats.pendingTrips, color: "danger", icon: cilSettings, path: "/trips" },
    { title: "Completed Trips (This Month)", value: stats.completedThisMonth, color: "primary", icon: cilPeople, path: "/trips" },
    { title: "Operations Team", value: stats.operationsTeam, color: "info", icon: cilTouchApp, path: "/operations" },
    { title: "Total Drivers", value: stats.totalDrivers, color: "success", icon: cilInput, path: "/driverlogin" },
  ];

  useEffect(() => {
    document.documentElement.addEventListener("ColorSchemeChange", () => {
      widgetRefs.current.forEach((chartRef, idx) => {
        if (chartRef && chartRef.current) {
          setTimeout(() => {
            chartRef.current.data.datasets[0].pointBackgroundColor =
              getStyle(`--cui-${cards[idx].color}`);
            chartRef.current.update();
          });
        }
      });
    });
  }, [cards]);

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {cards.map((card, idx) => {
        const chartRef = React.createRef();
        widgetRefs.current[idx] = chartRef;

        return (
          <CCol sm={6} xl={4} xxl={3} key={card.title}>
            <CWidgetStatsA
              color={card.color}
              value={<>{card.value}</>}
              title={
                <>
                  <CIcon icon={card.icon} className="me-2" />
                  {card.title}
                </>
              }
              icon={card.icon}
              onClick={() => navigate(card.path)}
              action={
                <CDropdown alignment="end">
                  <CDropdownMenu>
                  </CDropdownMenu>
                </CDropdown>
              }
              chart={
                <CChartLine
                  ref={chartRef}
                  className="mt-3 mx-3"
                  style={{ height: "70px" }}
                  data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                    datasets: [
                      {
                        label: card.title,
                        backgroundColor: "transparent",
                        borderColor: "rgba(255,255,255,.55)",
                        pointBackgroundColor: getStyle(`--cui-${card.color}`),
                        data: [5, 10, 8, 15, 20, 18, card.value || 0],
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    scales: {
                      x: { display: false },
                      y: { display: false },
                    },
                    elements: {
                      line: { borderWidth: 1, tension: 0.4 },
                      point: { radius: 3, hitRadius: 10, hoverRadius: 4 },
                    },
                  }}
                />
              }
            />
          </CCol>
        );
      })}
    </CRow>
  );
};

Dashboard.propTypes = {
  className: PropTypes.string,
};

export default Dashboard;

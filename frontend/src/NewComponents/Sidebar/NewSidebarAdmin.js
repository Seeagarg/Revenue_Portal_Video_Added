import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./NewSidebarAdmin.module.css";

const NewSidebarAdmin = (props) => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  const sidebarItems = [
    {
      route: "/dashboardAdmin",
      highlight: 1,
      icon: "fa-solid fa-gauge",
      text: "Main Dashboard",
    },
    {
      route: "/dailyRevenueAdmin",
      highlight: 2,
      icon: "fa-solid fa-chart-simple",
      text: "Daily Revenue",
    },
    {
      route: "/monthlyRevenueAdmin",
      highlight: 3,
      icon: "fa-regular fa-chart-bar",
      text: "Monthly Revenue",
    },
    {
      route: "/uploadFlowVideo",
      highlight: 4,
      icon: "fa-solid fa-upload",
      text: "Upload Flow Video",
    },
  ];

  return (
    <div className={classes.sidebar_container}>
      <div className={classes.sidebar_sub_container}>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={classes.tab}
            style={{
              color: props.highlight === item.highlight ? "#696CFF" : "#6B7281",
            }}
            onClick={() => handleNavigate(item.route)}
            id="defaultOpen"
          >
            <i className={item.icon}></i>
            <span className={`${props.sidebarHide && classes.short}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewSidebarAdmin;


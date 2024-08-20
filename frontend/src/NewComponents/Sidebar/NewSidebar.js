import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./NewSidebar.module.css";

const NewSidebar = (props) => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  const sidebarItems = [
    {
      condition: !localStorage.getItem("hide_data"),
      route: "/dailyRevenue",
      highlight: 1,
      icon: "fa-solid fa-chart-simple",
      text: "Daily Revenue",
    },
    {
      condition: !localStorage.getItem("hide_data"),
      route: "/monthlyRevenue",
      highlight: 2,
      icon: "fa-regular fa-chart-bar",
      text: "Monthly Revenue",
    },
    {
      condition: localStorage.getItem("userName") !== "etho_1234" && !localStorage.getItem("hide_data"),
      route: "/dashboard",
      highlight: 3,
      icon: "fa-solid fa-wifi",
      text: "Add Networks",
    },
    {
      condition: localStorage.getItem("userName") !== "etho_1234" && !localStorage.getItem("hide_data"),
      route: "/add-country-and-add-operator",
      highlight: 4,
      icon: "fa-solid fa-globe",
      text: "Add Country and Add Operator",
    },
    {
      condition: localStorage.getItem("userName") !== "etho_1234",
      route: "/publisher-traffic",
      highlight: 5,
      icon: "fa-solid fa-bolt",
      text: "Publisher Traffic",
    },
    {
      condition: localStorage.getItem("userName") !== "etho_1234",
      route: "/publisher-subscription",
      highlight: 6,
      icon: "fa-solid fa-snowflake",
      text: "Publisher Subscription",
    },
    {
      condition: localStorage.getItem("userName") === "panz",
      route: "/advertiser",
      highlight: 7,
      icon: "fa-solid fa-rectangle-ad",
      text: "Advertiser",
    },
    {
      condition: localStorage.getItem("userName") === "panz",
      route: "/advertiser-traffic",
      highlight: 8,
      icon: "fa-solid fa-traffic-light",
      text: "Advertiser Traffic",
    },
    {
      condition: localStorage.getItem("userName") === "panz",
      route: "/advertiser-subscription",
      highlight: 9,
      icon: "fa-solid fa-asterisk",
      text: "Advertiser Subscription",
    },
  ];

  return (
    <div className={classes.sidebar_container}>
      <div className={classes.sidebar_sub_container}>
        {sidebarItems.map((item, index) => {
          return (
            item.condition && (
              <div
                key={index}
                className={classes.tab}
                style={{
                  color: props.highlight === item.highlight ? "#696CFF" : "#6B7281",
                }}
                onClick={() => handleNavigate(item.route)}
              >
                <i className={item.icon}></i>
                <span className={`${props.sidebarHide && classes.short}`}>
                  {item.text}
                </span>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default NewSidebar;

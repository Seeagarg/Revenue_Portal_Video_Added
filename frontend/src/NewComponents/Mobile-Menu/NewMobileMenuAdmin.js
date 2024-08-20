import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./NewMobileMenu.module.css";

const NewMobileMenuAdmin = (props) => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
    props.hideMobileMenuHandler();
  };

  const menuItems = [
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
    <div
      className={`${classes.mobile_menu_overlay} ${
        props.mobileMenu && classes.show
      }`}
      onClick={() => props.hideMobileMenuHandler()}
    >
      <div
        className={`${classes.mobile_menu_container} ${
          props.mobileMenu && classes.show
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.mobile_menu_sub_container}>
          <div className={classes.logo_center}>
            <img
              src="/assets/images/logo1.png"
              alt="Revenue portal"
              className={classes.logo}
            />
          </div>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={classes.tab}
              style={{
                color:
                  props.highlight === item.highlight ? "#696CFF" : "#6B7281",
              }}
              onClick={() => handleNavigate(item.route)}
            >
              <i className={item.icon}></i>
              <span className={`${props.sidebarHide && classes.short}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewMobileMenuAdmin;

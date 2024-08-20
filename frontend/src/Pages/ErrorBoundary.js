import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import classes from "./ErrorBoundary.module.css";
import { Button } from "primereact/button";
// import Cookies from 'js-cookie'

// ERROR BOUNDARY COMPONENT , DISPLAYS THE ERRORS THROW IN THE APP...
const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleClick=()=>{
    localStorage.clear();
    navigate('/')
  }

  return (
    <div className={classes.message_container}>
      <p className={classes.text}>Error!</p>
      <p className={classes.text}>{error?.message || error?.data || error?.statusText || error?.status || "Unknown Error"}</p>
      <Button
        onClick={handleClick}
        severity="danger"
        label="Go Back"
        style={{ fontFamily: "Montserrat,sans-serif" }}
        rounded
        icon="pi pi-arrow-left"
      />
    </div>
  );
};

export default ErrorBoundary;

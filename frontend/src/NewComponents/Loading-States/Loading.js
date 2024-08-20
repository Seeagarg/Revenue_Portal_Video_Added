import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={classes.center_loader}>
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loading;

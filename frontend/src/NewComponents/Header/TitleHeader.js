import React from "react";
import classes from "./TitleHeader.module.css";

const TitleHeader = ({ icon, title }) => {
  return (
    <div className={classes.title_container}>
      <div className={classes.title_sub_container}>
        {icon}
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default TitleHeader;

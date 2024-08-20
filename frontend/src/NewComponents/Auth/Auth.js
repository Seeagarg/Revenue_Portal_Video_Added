import React, { useEffect, useState } from "react";

// AUTH COMPONENT , IT WILL CHECK IF THE CLIENT IS AUTHORIZED TO VISIT THE PAGE OR NOT...
const Auth = ({ children, admin, conditionApply, condition }) => {
  const [auth, setAuth] = useState(false);

  // CHECK IF THE TOKEN IS THERE OR IF THE CONDITION IS MATCHED OR NOT , THROW ERRORS , ELSE setAuth(true)
  useEffect(() => {
    let token = localStorage.getItem("userToken");
    if (!token || token == null || token == undefined || token == "") {
      throw new Error("You are not Authorized , Please Login!");
    } else if (admin) {
      let checkAdmin = localStorage.getItem("userName");
      if (checkAdmin != "admin") {
        throw new Error("You are not Authorized as Admin!");
      } else {
        setAuth(true);
      }
    } else if (conditionApply) {
      if (condition) {
        throw new Error("You cannot access this page!");
      } else {
        setAuth(true);
      }
    } else {
      setAuth(true);
    }
  }, [localStorage, auth, condition, conditionApply, admin]);

  return <>{auth ? children : null}</>;
};

export default Auth;

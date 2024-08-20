import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, loginMasterApi } from "../Data/Api";
import Post from "../Request/Post";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import axios from "axios";
import classes from "./LoginPage.module.css";
import LoginAnimation from "../Animations/LoginAnimation.json";
import Lottie from "lottie-react";

// LOGIN PAGE FOR LOGGING IN THE CLIENT AND ADMIN...
const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({});
  const [inputType, setInputType] = useState("password");

  // PASSWORD'S EYE ICON CLICK HANDLER...
  const changeInputType = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  // FORM SUBMISSION HANDLER...
  const handleSubmit = async (e) => {
    e.preventDefault();

    // IF THE USERNAME ENTERED BY USER IS "admin" THAN HIT ADMIN LOGIN API
    if (credentials.username === "admin") {
      try {
        setLoader("block");
        const data = {
          username: credentials.username,
          password: credentials.password,
        };
        const res = await axios.post(loginMasterApi, data);
        localStorage.setItem("clients", JSON.stringify(res.data.data.data));
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userName", res.data.username);
        navigate("/dashboardAdmin");
        setLoader("none");
      } catch (error) {
        setLoader("none");
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            error?.data?.data?.message
        );
      }
    } 
    // ELSE HIT CLIENT LOGIN API
    else {
      setLoader("block");
      hitOnBackend();
    }
  };

  const hitOnBackend = () => {
    let promise = Post(loginApi, credentials);
    promise.then((e) => {
      handleCredResponse(e);
    });
  };

  const handleCredResponse = (e) => {
    if (e.response === "error") {
      toast.error(e.error?.response?.data?.message || e.error?.message);
      setLoader("none");
    } else {
      setLoader("none");
      let servicesArray = [];
      e.data.data.map((service) => {
        return servicesArray.push(service.serviceName);
      });
      localStorage.setItem("userToken", e.token);
      localStorage.setItem("userName", e.username);
      // localStorage.setItem("services", JSON.stringify(servicesArray));
      localStorage.setItem("services", JSON.stringify(e.data.data));
      localStorage.setItem("serviceObject", JSON.stringify(e.data.data));
      localStorage.setItem("country", JSON.stringify(e.country));

      // FROM CLIENT API RESPONSE , IF WE GET "hide_data" , THAN ONLY SHOW PUBLISHER TRAFFIC AND PUBLISHER SUBSCRIPTION DATA.. 
      if (e?.hide_data) {
        localStorage.setItem("hide_data", e?.hide_data);
        navigate("/publisher-traffic");
        return;
      }
      // ELSE NAVIGATE THE USER TO "dailyRevenue" PAGE
      localStorage.removeItem("hide_data");
      navigate("/dailyRevenue");
    }
  };

  const [loader, setLoader] = useState("none");

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <div className={classes.container}>
        <div className={classes.sub_container}>
          <div className={classes.grid_container}>
            <div className={classes.grid_item_1}>
              <div className={classes.animation_container}>
                <Lottie
                  className={classes.animation}
                  animationData={LoginAnimation}
                  autoplay={true}
                  loop={true}
                />
              </div>
            </div>
            <div className={classes.grid_item_2}>
              <div className={classes.heading_container}>
                <h3 className={classes.heading}>Revenue Portal</h3>
              </div>
              <div className={classes.form_container}>
                <form onSubmit={handleSubmit}>
                  <div className={classes.form_sub_container}>
                    <div className={classes.input_form}>
                      <i className="fa fa-user" aria-hidden="true"></i>
                      <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        required
                        autoComplete="off"
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={classes.input_form}>
                      <input
                        type={inputType}
                        placeholder="Password"
                        name="password"
                        required
                        style={{ zIndex: "1" }}
                        autoComplete="off"
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                      />
                      <i
                        className={`fa fa-eye ${classes.icon}`}
                        onClick={changeInputType}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <button type="submit" className={classes.login_button}>
                      <i className="fa fa-sign-in" aria-hidden="true"></i>
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;

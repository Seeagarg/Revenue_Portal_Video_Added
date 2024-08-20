import React, { useEffect, useState } from "react";
import classes from "./DashboardPage.module.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllServices } from "../Data/Api";
import axios from "axios";
import Loader from "../NewComponents/Loading-States/Loader";
import { toast, ToastContainer } from "react-toastify";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import TitleHeader from "../NewComponents/Header/TitleHeader";

// DASHBOARD PAGE (ADD NETWORKS PAGE)
const DashboardPage = ({
  serviceName,
  id,
  mainServiceId,
  mainServiceName,
  children,
}) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [loader, setLoader] = useState("block");
  const navigate = useNavigate();

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  // GET THE SERVICES DATA ....
  useEffect(() => {
    const fetchDataFromBackend = async () => {
      setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        const response = await axios.post(fetchAllServices, "", {
          headers: headers,
        });
        setLoader("none");
        setServices(response.data.data);
        setFilteredServices(() =>
          response.data.data?.filter(
            (service) => service?.service == serviceName
          )
        );
        // setServices(()=>response.data.data?.filter((service)=>service?.service==serviceName));
        let main_services = JSON.parse(localStorage.getItem("serviceObject"));
        setMainServices(main_services);
      } catch (error) {
        setLoader("none");
        if (error?.response?.status == 403) {
          toast.error(
            error?.response?.data?.message ||
              error?.data?.message ||
              error?.message ||
              error
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.data?.message ||
              error?.message ||
              error
          );
        }
      }
    };
    fetchDataFromBackend();
    localStorage.setItem("showAddPublisher", false);
  }, []);

  // FUNCTION TO HANDLE SERVICE AND SUB-SERVICE CLICK
  const handleNavigateAndFilterServices = (
    path,
    serviceName,
    showAddPublisher,
    checkMainService,
    idMainService,
    nameMainService
  ) => {
    setFilteredServices(() =>
      services.filter((service) => service?.service == serviceName)
    );

    if (showAddPublisher) {
      localStorage.setItem("showAddPublisher", JSON.stringify(true));
    } else {
      localStorage.setItem("showAddPublisher", JSON.stringify(false));
    }

    if (checkMainService?.useMainService) {
      navigate(path, {
        state: {
          mainServiceId: mainServiceId,
          mainServiceName: mainServiceName,
        },
      });
    } else {
      navigate(path, {
        state: {
          mainServiceId: idMainService,
          mainServiceName: nameMainService,
        },
      });
    }
  };

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <div className={`${classes.main} ${sidebarHide && classes.short}`}>
        <div className={`${classes.sidebar} ${sidebarHide && classes.short}`}>
          <div
            className={`${classes.sidebar_header} ${
              sidebarHide && classes.short
            }`}
          >
            <img
              src="/assets/images/logo1.png"
              alt="Revenue portal"
              className={classes.sidebar_logo}
            />
            <h3 className={classes.dashboard_text}>Dashboard</h3>
          </div>
          <div className={classes.sidebar_icon}>
            <div className={classes.circle} onClick={sidebarHandler}>
              {sidebarHide ? (
                <i
                  className={`fa-solid fa-arrow-right ${classes.arrow_icon}`}
                ></i>
              ) : (
                <i
                  className={`fa-solid fa-arrow-left ${classes.arrow_icon}`}
                ></i>
              )}
            </div>
          </div>
          <NewSidebar highlight={3} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service="All Services" highlight={3} />
          <div className={classes.sub_container}>
            <TitleHeader title="Main Services" icon="" />
            <div className={classes.flex_container}>
              {mainServices.map((service, i) => {
                return (
                  <div key={i} className={classes.flex_item}>
                    <Button
                      className={classes.btn}
                      // onClick={() => navigate(`/dashboard/${service.serviceName}/${service.id}`)}
                      onClick={() =>
                        handleNavigateAndFilterServices(
                          `/dashboard/${service.serviceName}/${service.id}`,
                          `${service.serviceName}`,
                          false,
                          { useMainService: false },
                          service?.id,
                          service?.serviceName
                        )
                      }
                      variant={
                        (id == service.id &&
                          serviceName == service.serviceName) ||
                        (mainServiceId == service.id &&
                          mainServiceName == service.serviceName)
                          ? "contained"
                          : "outlined"
                      }
                      // color="error"
                      size="medium"
                    >
                      {service.serviceName}
                    </Button>
                  </div>
                );
              })}
            </div>

            {filteredServices.length > 0 && (
              <TitleHeader title="Sub Services" icon="" />
            )}

            <div className={classes.flex_container}>
              {filteredServices.map((service, i) => {
                return (
                  <div key={i} className={classes.flex_item}>
                    <Button
                      onClick={() =>
                        handleNavigateAndFilterServices(
                          `/dashboard/${service.subService}/${service.serviceId}`,
                          `${service.service}`,
                          true,
                          { useMainService: true }
                        )
                      }
                      variant={
                        id == service.serviceId &&
                        serviceName === service.subService
                          ? "contained"
                          : "outlined"
                      }
                      // color="error"
                      size="medium"
                    >
                      {service.subService}
                    </Button>
                  </div>
                );
              })}
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

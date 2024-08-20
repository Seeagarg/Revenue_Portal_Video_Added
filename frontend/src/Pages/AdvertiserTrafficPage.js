import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import axios from "axios";
import {
  advertiserTrafficApi,
  advertiserTrafficClientsApi,
  advertiserTrafficServicesApi,
} from "../Data/Api";
import classes from "./DailyRevenuePage.module.css";
import moment from "moment";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AdvertiserTrafficPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState("block");
  const [traffic, setTraffic] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [startDateForCalendar, setStartDateForCalendar] = useState(new Date());
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [service, setService] = useState("");
  const [client, setClient] = useState("");

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  const fetchAdvertiserTrafficClients = async () => {
    const data = {
      client: localStorage.getItem("userName"),
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(advertiserTrafficClientsApi, data, {
        headers: headers,
      });
      setClients(res?.data?.result);
      let newClient = { client_name: "All" };
      setClients((prevClients) => {
        return [newClient, ...prevClients];
      });
      setClient(newClient?.client_name);
      setService("All");
      setLoading("none");
    } catch (error) {
      setLoading("none");
      if (error?.response?.status == 403) {
        return;
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

  const fetchAdvertiserTrafficServices = async (clientName) => {
    const data = {
      client: clientName,
    };
    try {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(advertiserTrafficServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.result);
      setService(res?.data?.result[0]?.serviceName);
    } catch (error) {
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

  const fetchDataFromBackend = async () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
      service: service !== "" ? service : "All",
      client: client !== "" ? client : "All",
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const res = await axios.post(advertiserTrafficApi, data, {
        headers: headers,
      });
      setTraffic(res.data.result);
      setLoading("none");
    } catch (error) {
      setLoading("none");
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

  useEffect(() => {
    fetchAdvertiserTrafficClients();
    setServices([{ serviceName: "All" }]);
    fetchDataFromBackend();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    fetchDataFromBackend();
  };

  const handleServiceChange = (service) => {
    setService(service);
  };

  const handleClientChange = (client) => {
    setClient(client);
    if (client === "All") {
      setServices([{ serviceName: "All" }]);
      setService("All");
    } else {
      fetchAdvertiserTrafficServices(client);
    }
  };

  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    setStartDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    setEndDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  return (
    <>
      <Loader value={loading} />
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
          <NewSidebar highlight={8} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service="Advertiser Traffic" highlight={8} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.client}>
                <Dropdown
                  value={client}
                  onChange={(e) => handleClientChange(e.value)}
                  options={clients?.map((data) => ({
                    label: data?.client_name,
                    value: data?.client_name,
                  }))}
                  placeholder="Select a Client"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.serviceName,
                    value: data?.serviceName,
                  }))}
                  placeholder="Select Service"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  // value={startDate}
                  value={startDateForCalendar}
                  onChange={(e) => convertStartDate(e.value)}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="Start Date"
                  style={{ width: "100%" }}
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  // value={endDate}
                  value={endDateForCalendar}
                  onChange={(e) => convertEndDate(e.value)}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="End Date"
                  style={{ width: "100%" }}
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader
              title="Advertiser Traffic"
              icon={<i className="fa-solid fa-bolt" aria-hidden="true"></i>}
            />

            {traffic ? (
              <div className={classes.table_container}>
                <DataTable
                  value={traffic}
                  emptyMessage="No data found"
                  showGridlines
                  responsive
                  scrollable
                  scrollHeight="500px"
                  rows={15}
                  paginator
                >
                  <Column field="clientName" header="Client" />
                  <Column field="serviceName" header="Service" />
                  <Column field="publisher" header="Publisher" />
                  <Column field="country" header="Country" />
                  <Column field="operator" header="Operator" />
                  <Column field="COUNT" header="Count" />
                </DataTable>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertiserTrafficPage;

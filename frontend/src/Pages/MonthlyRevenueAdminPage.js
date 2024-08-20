import React, { useEffect, useState } from "react";
import { sendMonthlyDataApi } from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import GetSecure from "../Request/GetSecure";
import Loader from "../NewComponents/Loading-States/Loader";
import axios from "axios";
import { fetchClientServices } from "../Data/Api";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import classes from "./DailyRevenuePage.module.css";
import NewSidebarAdmin from "../NewComponents/Sidebar/NewSidebarAdmin";
import NewHeader from "../NewComponents/Header/NewHeader";
import { Dropdown } from "primereact/dropdown";
import NewHeaderAdmin from "../NewComponents/Header/NewHeaderAdmin";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ExportMonthlyRevenueToExcel from "../NewComponents/Excel-Sheet-Generation/ExportMonthlyRevenueToExcel";
import { TabView, TabPanel } from "primereact/tabview";
import LineGraph from "../NewComponents/Graphs/LineGraph";
import BarGraph from "../NewComponents/Graphs/BarGraph";
import VerticalBarGraph from "../NewComponents/Graphs/VerticalBarGraph";
// import ExportToExcel from "../Components/ExportToExcel";

const MonthlyRevenueAdminPage = () => {
  const [clients, setClients] = useState([]);
  const [clientForDropdown, setClientForDropdown] = useState("");
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

  //to start on load
  useEffect(() => {
    const clients_variable = JSON.parse(localStorage.getItem("clients"));
    setClients(clients_variable);
    setClientForDropdown(clients_variable[0]);
    gettingClientServices(clients_variable[0].id);
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);
  const [responseService, setResponseService] = useState("");
  const [service, setService] = useState();

  async function gettingClientServices(clientId) {
    try {
      setLoader("block");
      //fetch Services of that client and store in localStorage;
      // gettingServices() function call;
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(
        `${fetchClientServices}?clientId=${clientId}`,
        data,
        {
          headers: headers,
        }
      );
      let servicesArray = [];
      res.data.data.map((service) => {
        return servicesArray.push(service.serviceName);
      });
      localStorage.setItem("services", JSON.stringify(servicesArray));
      gettingServices();
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
  }

  //Getting Services
  const gettingServices = () => {
    let services = JSON.parse(localStorage.getItem("services"));
    setServices(services);
    setService(services[0]);
    getDataFromBackend(services[0]);
  };

  //Hook to store dates
  const [interval, setInterval] = useState("6");

  //Method to get data from Backend
  const getDataFromBackend = (service) => {
    let promise = GetSecure(
      `${sendMonthlyDataApi}?interval=${interval}&service=${service}`
    );
    promise.then((e) => {
      handleDataResponse(e);
    });
  };

  //Hook to store data
  const [data, setData] = useState([]);

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);
  const [biggestRenewal, setBiggestRenewal] = useState(0);
  const [biggestSubscription, setBiggestSubscription] = useState(0);

  //Method to handle response
  const handleDataResponse = (e) => {
    if (e.response === "error") {
      setLoader("none");
      if (e?.error?.response?.status == 403) {
        toast.error(e.error?.response?.data?.message || e.error?.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(e.error?.response?.data?.message || e.error?.message);
      }
    } else {
      setLoader("none");
      const dataDateManupulate = e.data.map((dataItem) => {
        return {
          id: `${dataItem.MONTH}-${dataItem.YEAR}`,
          misDate: `${dataItem.MONTH}-${dataItem.YEAR}`,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
        };
      });
      setData(dataDateManupulate.reverse());
      setResponseService(e.serviceName);
      const biggestValue = Math.max.apply(
        Math,
        e.data.map(function (dataItem) {
          return dataItem.totalRevenue;
        })
      );
      setBiggest(biggestValue);
      const biggestValueRenewal = Math.max.apply(
        Math,
        e.data.map(function (dataItem) {
          return dataItem.renewalsRevenue;
        })
      );
      setBiggestRenewal(biggestValueRenewal);
      const biggestValueSubscription = Math.max.apply(
        Math,
        e.data.map(function (dataItem) {
          return dataItem.subscriptionRevenue;
        })
      );
      setBiggestSubscription(biggestValueSubscription);
    }
  };

  //Method to handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoader("block");
    getDataFromBackend(service);
  };

  //Hook to store loader div state
  const [loader, setLoader] = useState("block");

  //Method to handle service choose
  const handleChooseService = (serviceName) => {
    setService(serviceName);
    getDataFromBackend(serviceName);
  };

  const handleClientChange = (client) => {
    setClientForDropdown(client);
    gettingClientServices(client?.id);
  };

  const dataLength = data.length;
  let width = 3000;
  if (dataLength > 10) {
    width = 1000;
  }
  if (dataLength > 0 && dataLength <= 10) {
    width = 700;
  }

  const totalRenewalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.renewalsRevenue,
    0
  );
  const totalSubscriptionRevenue = data.reduce(
    (total, dataItem) => total + dataItem.subscriptionRevenue,
    0
  );
  const totalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.totalRevenue,
    0
  );

  const totals = {
    id: totalRevenue,
    misDate: "Totals",
    renewalsRevenue: totalRenewalRevenue,
    subscriptionRevenue: totalSubscriptionRevenue,
    totalRevenue: totalRevenue,
  };

  const header = <ExportMonthlyRevenueToExcel data={[...data, totals]} />;

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
          <NewSidebarAdmin highlight={3} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeaderAdmin service={responseService} highlight={3} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <div className={classes.client}>
                <Dropdown
                  value={clientForDropdown}
                  onChange={(e) => handleClientChange(e.value)}
                  options={clients?.map((client) => ({
                    label: client?.clientName,
                    value: client,
                  }))}
                  placeholder="Select a client"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleChooseService(e.value)}
                  options={services?.map((serviceItem) => ({
                    label: serviceItem,
                    value: serviceItem,
                  }))}
                  placeholder="Select a service"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.start_date}>
                <Dropdown
                  id="interval"
                  value={interval}
                  options={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },
                    { label: "6", value: "6" },
                    { label: "7", value: "7" },
                    { label: "8", value: "8" },
                    { label: "9", value: "9" },
                    { label: "10", value: "10" },
                    { label: "11", value: "11" },
                    { label: "12", value: "12" },
                  ]}
                  onChange={(e) => setInterval(e.value)}
                  placeholder="Select Month"
                  style={{ width: "100%" }}
                />
              </div>

              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader title="Monthly Revenue" icon="" />

            <TabView style={{ width: "100%" }} scrollable>
              <TabPanel header="Bar Chart">
                <BarGraph data={data} />
              </TabPanel>
              <TabPanel header="Line Chart">
                <LineGraph data={data} />
              </TabPanel>
              <TabPanel header="Vertical Bar Chart">
                <VerticalBarGraph data={data} />
              </TabPanel>
            </TabView>

            <div className={classes.table_container}>
              <DataTable
                value={[...data, totals]}
                emptyMessage="No data found"
                showGridlines
                responsive
                scrollable
                scrollHeight="500px"
                rows={40}
                paginator
                header={header}
              >
                <Column field="misDate" header="Date" />
                <Column field="renewalsRevenue" header="Renewals Revenue" />
                <Column
                  field="subscriptionRevenue"
                  header="Subscription Revenue"
                />
                <Column field="totalRevenue" header="Total Revenue" />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MonthlyRevenueAdminPage;

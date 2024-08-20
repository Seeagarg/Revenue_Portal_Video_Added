import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import {
  fetchClientServices,
  fetchClientSubServicesApi,
  sendDataApi,
} from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import axios from "axios";
import classes from "./DailyRevenuePage.module.css";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import NewSidebarAdmin from "../NewComponents/Sidebar/NewSidebarAdmin";
import NewHeaderAdmin from "../NewComponents/Header/NewHeaderAdmin";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import ExportDailyRevenueAdmin from "../NewComponents/Excel-Sheet-Generation/ExportDailyRevenueAdmin";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import LineGraph from "../NewComponents/Graphs/LineGraph";
import BarGraph from "../NewComponents/Graphs/BarGraph";
import VerticalBarGraph from "../NewComponents/Graphs/VerticalBarGraph";

const DailyRevenueAdminPage = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [clientForDropdown, setClientForDropdown] = useState("");

  const [subServices, setSubServices] = useState([]);
  const [subService, setSubService] = useState("");

  const [tabIndex, setTabIndex] = useState(0);

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
    const countries_variables = clients_variable[0]?.countries;
    setCountries(countries_variables);
    setCountry(clients_variable[0]?.countries[0]);
    setClients(clients_variable);
    setClient(clients_variable[0]?.id);
    setClientForDropdown(clients_variable[0]);
    // gettingClientServices(clients_variable[0].id);
    gettingClientServices(
      clients_variable[0].id,
      clients_variable[0]?.countries[0]
    );
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);
  const [biggestRenewal, setBiggestRenewal] = useState(0);
  const [biggestSubscription, setBiggestSubscription] = useState(0);

  async function gettingClientServices(clientId, countryName) {
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
      localStorage.setItem("services", JSON.stringify(res?.data?.data));
      gettingServices(countryName);
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
  const gettingServices = (countryName) => {
    let services2 = JSON.parse(localStorage.getItem("services"));
    let filteredServices = services2.filter(
      (data) => data?.country == countryName
    );
    setServices(filteredServices);
    getDataFromBackend(filteredServices[0]?.serviceName, services2);
  };

  //Hook to store dates
  const [dates, setDates] = useState({
    to: moment(new Date()).format("yyyy-MM-DD"),
    from: moment().subtract(30, "days").format("yyyy-MM-DD"),
  });

  const [startDateForCalendar, setStartDateForCalendar] = useState(
    moment().subtract(30, "days").toDate()
  );
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());

  const [service, setService] = useState("");
  const [responseService, setResponseService] = useState("");

  const fetchSubServices = async (serviceid) => {
    try {
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        `${fetchClientSubServicesApi}?mainServiceId=${serviceid}`,
        null,
        {
          headers: headers,
        }
      );

      setSubServices(response?.data?.data?.dataArray);
      setSubService(() => response?.data?.data?.dataArray[0]?.subServiceName);
      return response?.data?.data?.dataArray[0]?.subServiceName;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          error
      );
      if (error?.response?.status == 403) {
        throw new Error("Token Expired , Please Login!");
      }
    }
  };

  //Method to get data from Backend
  const getDataFromBackend = async (service2, allServices) => {
    setService(service2);
    const serviceid = allServices.filter(
      (data) => data?.serviceName == service2
    );

    if (serviceid.length > 0) {
      const subServiceValue = await fetchSubServices(serviceid[0]?.id);
      let data = {
        from: dates.from,
        to: dates.to,
        serviceName: service2,
        subServiceName: subServiceValue,
      };

      let promise = PostSecure(sendDataApi, data);
      promise
        .then((e) => {
          handleDataResponse(e);
        })
        .catch((err) => toast.error(err?.data?.message || err?.message || err));
    }
  };

  const getDataFromBackend2 = async (selectedSubService) => {
    setSubService(selectedSubService);
    let data = {
      from: dates.from,
      to: dates.to,
      serviceName: service,
      subServiceName: selectedSubService,
    };

    let promise = PostSecure(sendDataApi, data);
    promise
      .then((e) => {
        handleDataResponse(e);
      })
      .catch((err) => toast.error(err?.data?.message || err?.message || err));
  };

  //Hook to store data
  const [data, setData] = useState([]);

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
      const dataFromBackend = e.data;
      const dataDateManupulate = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem?.id,
          misDate: dataItem?.misDate.substring(0, 10),
          totalBase: dataItem?.totalBase,
          totalActiveBase: dataItem?.totalActiveBase,
          subscriptions: dataItem?.subscriptions,
          unsubscriptions: dataItem?.unsubscriptions,
          renewalsRevenue: dataItem?.renewalsRevenue,
          renewals: dataItem?.renewals,
          subscriptionRevenue: dataItem?.subscriptionRevenue,
          totalRevenue: dataItem?.totalRevenue,
          totalRevenueAccumulated: dataItem?.DailyIncreaseAccumulated,
        };
      });

      const dataLimit = dataDateManupulate.slice(0, 33);
      setData(dataLimit.reverse());

      const biggestValue = Math.max.apply(
        Math,
        dataLimit.map(function (dataItem) {
          return dataItem.totalRevenue;
        })
      );
      setResponseService(e.service);
      setBiggest(biggestValue);
      const biggestValueRenewal = Math.max.apply(
        Math,
        dataLimit.map(function (dataItem) {
          return dataItem.renewalsRevenue;
        })
      );
      setBiggestRenewal(biggestValueRenewal);
      const biggestValueSubscription = Math.max.apply(
        Math,
        dataLimit.map(function (dataItem) {
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
    // let allServices = JSON.parse(localStorage.getItem("services"));
    // getDataFromBackend(service,allServices);
    getDataFromBackend2(subService);
  };

  //Hook to store loader div state
  const [loader, setLoader] = useState("block");

  const dataLength = data.length;
  let width = 3000;
  if (dataLength > 25) {
    width = 3000;
  }
  if (dataLength > 17 && dataLength <= 25) {
    width = 2200;
  }
  if (dataLength > 10 && dataLength <= 17) {
    width = 1800;
  }
  if (dataLength >= 5 && dataLength <= 10) {
    width = 1100;
  }
  if (dataLength > 0 && dataLength < 5) {
    width = 500;
  }

  const monthlyTotalSubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.subscriptions,
    0
  );
  const monthlyTotalUnsubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.unsubscriptions,
    0
  );
  const totalRenewalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.renewalsRevenue,
    0
  );
  const totalSubscriptionRevenue = data.reduce(
    (total, dataItem) => total + dataItem.subscriptionRevenue,
    0
  );
  const monthlyTotalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.totalRevenue,
    0
  );
  const totals = {
    id: monthlyTotalRevenue,
    misDate: "Totals",
    subscriptions: monthlyTotalSubscriptions,
    unsubscriptions: monthlyTotalUnsubscriptions,
    renewalsRevenue: totalRenewalRevenue,
    subscriptionRevenue: totalSubscriptionRevenue,
    totalRevenue: monthlyTotalRevenue,
  };

  const handleServiceChange = (service) => {
    setLoader("block");
    let allServices = JSON.parse(localStorage.getItem("services"));
    getDataFromBackend(service, allServices);
  };

  const handleClientChange = (client) => {
    let username = client?.username;
    const clients_variable = JSON.parse(localStorage.getItem("clients"));
    const countries_variables = clients_variable?.filter(
      (data) => data?.username == username
    );
    setCountries(countries_variables[0]?.countries);
    setCountry(countries_variables[0]?.countries[0]);
    setClientForDropdown(client);
    setClient(client?.id);
    gettingClientServices(client?.id, countries_variables[0]?.countries[0]);
  };

  const handleCountryChange = (selectedCountry) => {
    let services2 = JSON.parse(localStorage.getItem("services"));
    let filteredServices = services2.filter(
      (data) => data?.country == selectedCountry
    );
    setCountry(selectedCountry);
    setServices(filteredServices);
    getDataFromBackend(filteredServices[0]?.serviceName, services2);
  };

  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    // setDates({ ...dates, from: utcDate });
    setDates({
      ...dates,
      from: moment(new Date(utcDate)).format("yyyy-MM-DD"),
    });
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    // setDates({ ...dates, to: utcDate });
    setDates({ ...dates, to: moment(new Date(utcDate)).format("yyyy-MM-DD") });
  };

  const handleTabChanged = (indexValue) => {
    setTabIndex(indexValue);
  };

  const handleSubServiceChange = (selectedSubService) => {
    getDataFromBackend2(selectedSubService);
  };

  const header = (
    <ExportDailyRevenueAdmin
      data={[...data, totals]}
      handleTabChanged={handleTabChanged}
      tabIndex={tabIndex}
    />
  );

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
          <NewSidebarAdmin highlight={2} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeaderAdmin service={responseService} highlight={2} />
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
                  placeholder="Select a Client"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.client}>
                <Dropdown
                  value={country}
                  onChange={(e) => handleCountryChange(e.value)}
                  options={countries?.map((data) => ({
                    label: data,
                    value: data,
                  }))}
                  placeholder="Select a Country"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((service) => ({
                    label: service?.serviceName,
                    value: service?.serviceName,
                  }))}
                  placeholder="Select a Service"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={subService}
                  onChange={(e) => handleSubServiceChange(e.target.value)}
                  options={subServices?.map((service) => ({
                    label: service?.subServiceName,
                    value: service?.subServiceName,
                  }))}
                  placeholder="Select a Sub Service"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  value={startDateForCalendar}
                  onChange={(e) => convertStartDate(e.value)}
                  showIcon
                  showButtonBar
                  placeholder="Start Date"
                  style={{ width: "100%" }}
                  maxDate={endDateForCalendar}
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  value={endDateForCalendar}
                  onChange={(e) => convertEndDate(e.value)}
                  showIcon
                  showButtonBar
                  placeholder="End Date"
                  style={{ width: "100%" }}
                  minDate={startDateForCalendar}
                  maxDate={new Date()}
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader title="Revenue" icon="" />

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

            {/* <NewLineGraph data={data} width={width} biggest={biggest} /> */}

            <div className={classes.table_container}>
              {/* <div className={classes.table_sub_container}> */}
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
                {(tabIndex == 0 || tabIndex == 1) && (
                  <Column
                    field="totalBase"
                    header="Total Subscription"
                    body={(rowData) =>
                      rowData?.totalBase ? rowData?.totalBase : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 1) && (
                  <Column
                    field="totalActiveBase"
                    header="Active Subscription"
                    body={(rowData) =>
                      rowData?.totalActiveBase ? rowData?.totalActiveBase : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 1) && (
                  <Column
                    field="subscriptions"
                    header="Paid Subscriptions"
                    body={(rowData) =>
                      rowData?.subscriptions ? rowData?.subscriptions : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 2) && (
                  <Column
                    field="unsubscriptions"
                    header="Unsubscriptions"
                    body={(rowData) =>
                      rowData?.unsubscriptions ? rowData?.unsubscriptions : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 3) && (
                  <Column
                    field="renewals"
                    header="Renewals Count"
                    body={(rowData) =>
                      rowData?.renewals ? rowData?.renewals : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 3 || tabIndex == 4) && (
                  <Column
                    field="renewalsRevenue"
                    header="Renewal Revenue"
                    body={(rowData) =>
                      rowData?.renewalsRevenue ? rowData?.renewalsRevenue : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 1 || tabIndex == 4) && (
                  <Column
                    field="subscriptionRevenue"
                    header="Subscription Revenue"
                    body={(rowData) =>
                      rowData?.subscriptionRevenue
                        ? rowData?.subscriptionRevenue
                        : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 4) && (
                  <Column
                    field="totalRevenue"
                    // header="Total Revenue"
                    header="Daily Revenue"
                    body={(rowData) =>
                      rowData?.totalRevenue ? rowData?.totalRevenue : 0
                    }
                  />
                )}
                {(tabIndex == 0 || tabIndex == 4) && (
                  <Column
                    field="totalRevenueAccumulated"
                    // header="Total Revenue"
                    header="Total Revenue"
                    body={(rowData) =>
                      rowData?.totalRevenueAccumulated
                        ? rowData?.totalRevenueAccumulated
                        : 0
                    }
                  />
                )}
              </DataTable>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyRevenueAdminPage;

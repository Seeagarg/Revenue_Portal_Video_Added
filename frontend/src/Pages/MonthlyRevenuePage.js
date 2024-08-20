import React, { useEffect, useState } from "react";
import { sendMonthlyDataApi } from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import GetSecure from "../Request/GetSecure";
import Loader from "../NewComponents/Loading-States/Loader";
import classes from "./DailyRevenuePage.module.css";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ExportMonthlyRevenueToExcel from "../NewComponents/Excel-Sheet-Generation/ExportMonthlyRevenueToExcel";
import { TabView, TabPanel } from "primereact/tabview";
import LineGraph from "../NewComponents/Graphs/LineGraph";
import BarGraph from "../NewComponents/Graphs/BarGraph";
import VerticalBarGraph from "../NewComponents/Graphs/VerticalBarGraph";

// MONTHLY REVENUE PAGE...
const MonthlyRevenuePage = () => {
  // GET THE SERVICES FROM LOCAL-STORAGE...
  useEffect(() => {
    gettingServices();
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);
  const [responseService, setResponseService] = useState("");
  const [service, setService] = useState();

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  //Getting Services
  const gettingServices = () => {
    let services = JSON.parse(localStorage.getItem("services"));
    setServices(services);
    setService(services[0]?.serviceName);
    // GET THE DATA OF 1ST SERVICE
    getDataFromBackend(services[0]?.serviceName);
  };

  // MONTH ...
  const [interval, setInterval] = useState("6");

  // METHOD TO GET THE DATA FROM BACKEND...
  const getDataFromBackend = (service) => {
    let promise = GetSecure(
      `${sendMonthlyDataApi}?interval=${interval}&service=${service}`
    );
    promise.then((e) => {
      handleDataResponse(e);
    });
  };

  const [data, setData] = useState([]);

  //METHOD TO HANDLE THE RESPONSE...
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
      // DATA MANUPULATE AND LIMIT THE DATA...
      const dataManupulate = e?.data.map((dataItem) => {
        return {
          id: `${dataItem.MONTH}-${dataItem.YEAR}`,
          misDate: `${dataItem.MONTH}-${dataItem.YEAR}`,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
        };
      });
      setData(dataManupulate.reverse());
      setResponseService(e.serviceName);
    }
  };

  // FORM SUBMISSION HANDLER...
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoader("block");
    getDataFromBackend(service);
  };

  //Hook to store loader div state
  const [loader, setLoader] = useState("block");

  // SERVICE CHANGE HANDLER...
  const handleChooseService = (serviceName) => {
    setService(serviceName);
    getDataFromBackend(serviceName);
  };

  // CALCULATION OF THE TOTAL...
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
    renewalsRevenue: totalRenewalRevenue.toFixed(0),
    subscriptionRevenue: totalSubscriptionRevenue.toFixed(0),
    totalRevenue: totalRevenue.toFixed(0),
  };

  // TOTAL CALCULATION FINISHED...

  const header = <ExportMonthlyRevenueToExcel data={[...data, totals]} />;

  return (
    <>
      {/* <!-- subscribers-sec --> */}
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
          <NewSidebar highlight={2} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service={responseService} highlight={2} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleChooseService(e.value)}
                  options={services?.map((service) => ({
                    label: service?.serviceName,
                    value: service?.serviceName,
                  }))}
                  placeholder="Select a Service"
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
                  placeholder="Select an interval"
                  style={{ width: "100%" }}
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader
              title="Monthly Revenue"
              icon={<i className="fa-regular fa-chart-bar"></i>}
            />

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

            {/* <div style={{ height: 600, width: "100%"}}> */}
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
export default MonthlyRevenuePage;

import React, { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { fetchClientOperatorApi, fetchClientSubServicesApi, sendDataApi } from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import NewHeader from "../NewComponents/Header/NewHeader";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import classes from "./DailyRevenuePage.module.css";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ExportDailyRevenueToExcel from "../NewComponents/Excel-Sheet-Generation/ExportDailyRevenueToExcel";
import axios from "axios";
import { TabView, TabPanel } from "primereact/tabview";
import LineGraph from "../NewComponents/Graphs/LineGraph";
import BarGraph from "../NewComponents/Graphs/BarGraph";
import VerticalBarGraph from "../NewComponents/Graphs/VerticalBarGraph";

// DAILY REVENUE PAGE....
const DailyRevenuePage = () => {
  //Hook to store loader div state
  const [loader, setLoader] = useState("block");



  // FIRST GET THE SERVICES FROM LOCAL-STORAGE...
  useEffect(() => {
    gettingServices();
  }, []);

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  const [dates, setDates] = useState({
    to: moment(new Date()).format("yyyy-MM-DD"),
    from: moment().subtract(30, "days").format("yyyy-MM-DD"),
  });

  const [startDateForCalendar, setStartDateForCalendar] = useState(
    moment().subtract(30, "days").toDate()
  );
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());

  const [service, setService] = useState("");
  const [country, setCountry] = useState("");
  const [subService, setSubService] = useState("");
  const [responseService, setResponseService] = useState("");
  const [operators,setOperators] = useState([])
  const [operator,setOperator] = useState('');

  const [services, setServices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [serviceId, setServiceId] = useState("");

  const [biggest, setBiggest] = useState(0);
  const [biggestRenewal, setBiggestRenewal] = useState(0);
  const [biggestSubscription, setBiggestSubscription] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  // GET THE SERVICES FROM THE LOCAL-STORAGE...
  const gettingServices = () => {
    let services2 = JSON.parse(localStorage.getItem("services"));
    let countries2 = JSON.parse(localStorage.getItem("country"));
    if(!countries2 || countries2.length == 0){
      setLoader('none')
      // return;
    }
    let filteredServices = services2.filter(
      (service) => service?.country == countries2[0]?.country
    );
    if(!countries2[0]?.country){

    }
    setCountry(countries2[0]?.country);
    // setServices(filteredServices);
    setCountries(countries2);
    fetchOperators(countries2[0]?.country)
    
    // GET THE DATA OF 1'ST SERVICE....
    // getDataFromBackend(filteredServices[0]?.serviceName, services2);
  };

  const fetchOperators=async(country)=>{
    try {
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const data ={
        country:country
      }

      const response = await axios.post(
        `${fetchClientOperatorApi}`,
        data,
        {
          headers: headers,
        }
      );
      const dataa = response?.data?.data?.result
      const filteredData = dataa.filter((item, index, self) =>
        index === self.findIndex((t) => t.operator === item.operator)
    )
     
      console.log(response?.data?.data?.result)
      setOperators(filteredData)
      
      localStorage.setItem('operators',JSON.stringify(filteredData))
      setServiceId(response?.data?.data?.result[0]?.id)
      setOperator(response?.data?.data?.result[0]?.operator)
      fetchSubServices(response?.data?.data?.result[0]?.operator)
      setService(response?.data?.data?.result[0]?.serviceName)
      getDataFromBackend(response?.data?.data?.result[0]?.serviceName,response?.data?.data?.result[0]?.operator );
     
      return response?.data?.data?.result[0];
    } catch (error) {
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
  }

  // FUNCTION FOR GETTING THE SUB-SERVICES OF THE MAIN SERVICE...
  const fetchSubServices = async (operator) => {
    try {
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        `${fetchClientSubServicesApi}?operator=${operator}`,
        null,
        {
          headers: headers,
        }
      );

      setSubServices(response?.data?.data?.dataArray);
      setSubService(() => response?.data?.data?.dataArray[0]?.subServiceName);
      return response?.data?.data?.dataArray[0]?.subServiceName;
    } catch (error) {
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

  const getDataFromBackend = async (service, operator) => {
    // setService(service2);

    // TAKE OUT THE SERVICE ID FROM THAT SERVICE...
    // const serviceid = servicesAll.filter(
    //   (data) => data?.serviceName == service2
    // );

    if (operator) {
      // GET THE 1'ST SUB-SERVICE OF THAT SERVICE THROUGH THIS API...
      const subServiceValue = await fetchSubServices(operator);
      let data = {
        from: dates.from,
        to: dates.to,
        serviceName: service,
        subServiceName: subServiceValue,
      };

      // HIT THE API TO GET THE DATA OF SERVICE'S SUB-SERVICE...
      let promise = PostSecure(sendDataApi, data);
      promise
        .then((e) => {
          handleDataResponse(e);
        })
        .catch((err) => toast.error(err?.data?.message || err?.message || err));
    }
  };

  const getDataFromBackend2 = async (selectedSubService) => {

    // if(!selectedSubService){
    //   return;
    // }
    
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
      .catch((err) => {
        toast.error(err?.data?.message || err?.message || err);
      });
  };

  const [data, setData] = useState([]);

  // HANDLING THE RESPONSE FROM THE API
  const handleDataResponse = (e) => {
    setLoader("none");
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

      // GETTING THE DATA AND MANUPULATING SOME DATA AND LIMITING THE DATA TO 33 LIMIT
      const dataFromBackend = e?.data;
      const dataManupulate = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem?.id,
          misDate: dataItem?.misDate.substring(0, 10),
          totalBase: dataItem?.totalBase,
          totalActiveBase: dataItem?.totalActiveBase,
          subscriptions: dataItem?.subscriptions,
          unsubscriptions: dataItem?.unsubscriptions,
          renewals: dataItem?.renewals,
          renewalsRevenue: dataItem?.renewalsRevenue,
          subscriptionRevenue: dataItem?.subscriptionRevenue,
          totalRevenue: dataItem?.totalRevenue,
          dailyIncreaseAccumulated: dataItem?.DailyIncreaseAccumulated,
        };
      });

      const dataLimit = dataManupulate.slice(0, 33);
      setData(dataLimit.reverse());
      setResponseService(e.service);
    }
  };


  console.log(loader,'LOADER______')
  // FORM SUBMISSION HANDLER...
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // setLoader("block");
    getDataFromBackend2(subService);
  };

  

  // CALCULATING THE TOTALS.....

  const monthlyTotalSubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.subscriptions,
    0
  );
  const monthlyTotalUnsubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.unsubscriptions,
    0
  );
  const totalRenewalRevenue =
    Math.round(
      data.reduce((total, dataItem) => total + dataItem.renewalsRevenue, 0) *
        100
    ) / 100;
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
    subscriptions: monthlyTotalSubscriptions.toFixed(0),
    unsubscriptions: monthlyTotalUnsubscriptions.toFixed(0),
    renewalsRevenue: totalRenewalRevenue.toFixed(0),
    subscriptionRevenue: totalSubscriptionRevenue.toFixed(0),
    totalRevenue: monthlyTotalRevenue.toFixed(0),
  };

  // TOTAL CALCULATION FINISHED HERE...

  // COUNTRY CHANGE HANDLER...
  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    let servicesAll = JSON.parse(localStorage.getItem("services"));
    let filteredServices = servicesAll.filter(
      (service) => service?.country == selectedCountry
    );
    setServices(filteredServices);
    fetchOperators(selectedCountry)
   
  };

  // SERVICE CHANGE HANDLER...
  const handleOperatorChange = (selectedOperator) => {
    // getDataFromBackend(selectedService, services);
    setOperator(selectedOperator)
    const op = JSON.parse(localStorage.getItem('operators'))

    // console.log(op,'operatorrrrrrrrrrrrrrrrrrrrrrrrrrrrr')

    let filteredItem = op.filter((item)=>item.operator == selectedOperator)
    console.log(filteredItem[0].id,'filterrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')

    const fetchedService = fetchSubServices(selectedOperator)
    getDataFromBackend(filteredItem[0].serviceName,selectedOperator)
  };

  // SUB-SERVICE CHANGE HANDLER....
  const handleSubServiceChange = (selectedSubService) => {
    getDataFromBackend2(selectedSubService);
  };

  // CONVERT DATE FUNCTIONS...
  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    setDates({
      ...dates,
      from: moment(new Date(utcDate)).format("yyyy-MM-DD"),
    });
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    setDates({ ...dates, to: moment(new Date(utcDate)).format("yyyy-MM-DD") });
  };

  // TAB CHANGE HANDLER...
  const handleTabChanged = (indexValue) => {
    setTabIndex(indexValue);
  };

  const header = (
    <ExportDailyRevenueToExcel
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
          <NewSidebar highlight={1} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service={responseService} highlight={1} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <div className={classes.service}>
                <Dropdown
                  key={country}
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  options={countries?.map((country) => ({
                    label: country?.country,
                    value: country?.country,
                  }))}
                  placeholder="Select a Country"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  key={operator}
                  value={operator}
                  onChange={(e) => handleOperatorChange(e.target.value)}
                  options={operators?.map((operator) => ({
                    label: operator?.operator,
                    value: operator?.operator,
                  }))}
                  // options={services}
                  // optionLabel="serviceName"
                  // optionValue="serviceName"
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
                  // touchUI
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

            <TitleHeader
              title="Daily Revenue"
              icon={<i className="fa-solid fa-chart-simple"></i>}
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
                    field="dailyIncreaseAccumulated"
                    header="Total Revenue"
                    body={(rowData) =>
                      rowData?.dailyIncreaseAccumulated
                        ? rowData?.dailyIncreaseAccumulated
                        : 0
                    }
                  />
                )}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyRevenuePage;
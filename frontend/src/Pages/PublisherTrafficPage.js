import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import axios from "axios";
import {
  publisherTrafficApi,
  publisherTrafficServicesApi,
  searchClickIdTrafficApi,
} from "../Data/Api";
import classes from "./DailyRevenuePage.module.css";
import moment from "moment";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import date from "../utils/date";
import PublisherSubscriptionPage from "./PublisherSubscriptionPage";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import Loading from "../NewComponents/Loading-States/Loading";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";

// PUBLISHER TRAFFIC PAGE...
const PublisherTrafficPage = () => {
  const [loading, setLoading] = useState("block");
  const [publisherData, setPublisherData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [startDateForCalendar, setStartDateForCalendar] = useState(new Date());
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());
  // const [date, setDate] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [services, setServices] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [service, setService] = useState("");
  const [publisher, setPublisher] = useState("");

  const [clickId, setClickId] = useState("");
  const [searchClickId, setSearchClickId] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [isRequestPending, setIsRequestPending] = useState(false);

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  // FETCH THE PUBLISHER TRAFFIC SERVICES AND PUBLISHER DATA..
  const fetchPublisherTrafficServices = async () => {
    const data = {
      client: localStorage.getItem("userName"),
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const res = await axios.post(publisherTrafficServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.services);
      setPublishers(res?.data?.publisher);

      // ADD NEW OPTION IN DROPDOWN WITH SERVICE AS "ALL"
      let newService = { service: "All" };

      setServices((prevServices) => {
        return [newService, ...prevServices];
      });

      setService(newService?.service);

      // SAME DO WITH PUBLISHER...
      let newPublisher = { publisher: "All" };
      setPublishers((prevPublishers) => {
        // Inserting the new service at the first index
        return [newPublisher, ...prevPublishers];
      });

      setPublisher(newPublisher?.publisher);
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
  const fetchDataFromBackend = async (
    showLoading,
    dateStart,
    dateEnd,
    serviceName,
    publisherName
  ) => {
    let data = {};
    if (serviceName == "All" || serviceName == "") {
      data = {
        client: localStorage.getItem("userName"),
        startDate: dateStart,
        endDate: dateEnd,
        service: "All",
        publisher: publisherName,
      };
    } else {
      data = {
        client: localStorage.getItem("userName"),
        startDate: dateStart,
        endDate: dateEnd,
        service: serviceName,
        publisher: publisherName,
      };
    }
    try {
      if (showLoading) {
        setLoading("block");
      }
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      setIsRequestPending(true);

      const res = await axios.post(publisherTrafficApi, data, {
        headers: headers,
      });
      setPublisherData(res.data.data);
      setIsRequestPending(false);
      setLoading("none");
    } catch (error) {
      setIsRequestPending(false);
      setLoading("none");

      if (error?.response?.status == 403) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            error?.data?.message
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            error?.data?.message
        );
      }
    }
  };

  // FETCH SERVICES AND PUBLISHER DATA AND THAN FETCH DATA OF THE "ALL" SERVICE AND PUBLISHER INITIALLY...
  useEffect(() => {
    fetchPublisherTrafficServices();
    fetchDataFromBackend(true, startDate, endDate, service, publisher);
  }, []);

  // REFETCH THE DATA AFTER EVERY 10 SECONDS...
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden && !isRequestPending) {
        fetchDataFromBackend(null, startDate, endDate, service, publisher);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate, service, publisher, isRequestPending]);

  // FORM SUBMISSION HANDLER...
  const submitHandler = async (e) => {
    e.preventDefault();
    fetchDataFromBackend(true, startDate, endDate, service, publisher);
  };

  // METHOD TO HANDLE SERVICE CHANGE...
  const handleServiceChange = (service) => {
    setService(service);
  };

  // METHOD TO HANDLE PUBLISHER CHANGE...
  const handlePublisherChange = (publisher) => {
    setPublisher(publisher);
  };

  // DATE CONVERTION FUNCTIONS..
  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    setStartDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    setEndDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  // CLICKID SEARCH HANDLER..
  const clickIdSearch = async (e) => {
    e.preventDefault();
    if (clickId.trim().length <= 0) {
      return;
    }
    try {
      setSearchClickId(true);
      setSearchLoading(true);
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        searchClickIdTrafficApi,
        {
          clickId: clickId,
        },
        {
          headers: headers,
        }
      );
      setSearchResults(response?.data?.data);
      setSearchLoading(false);
    } catch (error) {
      setSearchLoading(false);
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          error
      );
    }
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
          <NewSidebar highlight={5} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service="Publisher Traffic" highlight={5} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.service,
                    value: data?.service,
                  }))}
                  placeholder="Select a Service"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.partner}>
                <Dropdown
                  value={publisher}
                  onChange={(e) => handlePublisherChange(e.value)}
                  options={publishers?.map((data) => ({
                    label: data?.publisher,
                    value: data?.publisher,
                  }))}
                  placeholder="Select a Publisher"
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  value={startDateForCalendar}
                  onChange={(e) => convertStartDate(e.value)}
                  // onChange={(e) => setStartDate(e.value)}
                  showIcon
                  // touchUI
                  // showButtonBar
                  placeholder="Start Date"
                  style={{ width: "100%" }}
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  value={endDateForCalendar}
                  onChange={(e) => convertEndDate(e.value)}
                  // onChange={(e) => setEndDate(e.value)}
                  showIcon
                  // touchUI
                  // showButtonBar
                  placeholder="End Date"
                  style={{ width: "100%" }}
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <form className={classes.click_id_form} onSubmit={clickIdSearch}>
              <InputText
                type="text"
                value={clickId}
                onChange={(e) => setClickId(e.target.value)}
                className="p-inputtext-md"
                placeholder="Search Click Id"
              />
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader
              title="Publisher Traffic"
              icon={<i className="fa-solid fa-bolt" aria-hidden="true"></i>}
            />

            {publisherData ? (
              <div className={classes.table_container}>
                <DataTable
                  value={publisherData}
                  emptyMessage="No data found"
                  showGridlines
                  responsive
                  scrollable
                  scrollHeight="500px"
                  rows={15}
                  paginator
                >
                  <Column field="partnerid" header="Partner Id" />
                  <Column field="service" header="Service" />
                  <Column field="country" header="Country" />
                  <Column field="operator" header="Operator" />
                  <Column field="count" header="Count" />
                  <Column
                    style={{ minWidth: "200px" }}
                    body={(publisher) => {
                      return (
                        <p>
                          {date(publisher?.latest_date)?.date},{" "}
                          {date(publisher?.latest_date)?.time}
                        </p>
                      );
                    }}
                    header="Last Traffic Date-Time"
                  />
                </DataTable>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {localStorage.getItem("userName") == "h2n" && (
        <PublisherSubscriptionPage hide={true} />
      )}

      <Dialog
        header="Search Results"
        visible={searchClickId}
        maximizable
        style={{ width: "90%" }}
        onHide={() => {
          if (!searchClickId) return;
          setSearchClickId(false);
          // setClickId("");
        }}
      >
        <>
          <div className={classes.modal_content}>
            {searchLoading ? (
              <Loading />
            ) : searchResults.length > 0 ? (
              <DataTable
                value={searchResults}
                emptyMessage="No data found"
                showGridlines
                responsive
                scrollable
                scrollHeight="500px"
              >
                <Column
                  style={{ minWidth: "150px" }}
                  body={(data) => {
                    return (
                      <p>
                        {date(data?.date)?.date}, {date(data?.date)?.time}
                      </p>
                    );
                  }}
                  header="Date-Time"
                />
                <Column field="publisher" header="Publisher" />
                <Column field="service" header="Service" />
                <Column
                  body={(data) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <p>{data?.url?.slice(0, 12)}...</p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.url);
                          }}
                        >
                          <ContentCopyIcon
                            sx={{ color: "#696CFF" }}
                            fontSize="small"
                          />
                        </IconButton>
                      </div>
                    );
                  }}
                  header="Postback Url"
                />
                <Column
                  body={(data) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <p>{data?.refId?.slice(0, 12)}...</p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.refId);
                          }}
                        >
                          <ContentCopyIcon
                            sx={{ color: "#696CFF" }}
                            fontSize="small"
                          />
                        </IconButton>
                      </div>
                    );
                  }}
                  header="Ref Id"
                />
                <Column
                  body={(data) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <p>{data?.media?.slice(0, 12)}...</p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.media);
                          }}
                        >
                          <ContentCopyIcon
                            sx={{ color: "#696CFF" }}
                            fontSize="small"
                          />
                        </IconButton>
                      </div>
                    );
                  }}
                  header="Media Id"
                />
                <Column field="country" header="Country" />
                <Column field="operator" header="Operator" />
              </DataTable>
            ) : (
              <p className={classes.text}>No Records Found for : {clickId}</p>
            )}
          </div>
        </>
      </Dialog>
    </>
  );
};

export default PublisherTrafficPage;

import React, { useEffect, useState } from "react";
import Loader from "../NewComponents/Loading-States/Loader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  publisherSubscriptionApi,
  publisherSubscriptionServicesApi,
  searchClickIdSubApi,
} from "../Data/Api";
import moment from "moment";
import classes from "./DailyRevenuePage.module.css";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loading from "../NewComponents/Loading-States/Loading";
import date from "../utils/date";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton } from "@mui/material";

// PUBLISHER SUBSCRIPTION PAGE..
const PublisherSubscriptionPage = ({ hide }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState("block");
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );

  const [startDateForCalendar, setStartDateForCalendar] = useState(new Date());
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());

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

  // FETCH SERVICES AND PUBLISHER AND INSERT "ALL" AS FIRST OPTION IN THESE TWO DATA ...
  const fetchServices = async () => {
    try {
      setLoading("block");
      const client = localStorage.getItem("userName");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const data = { client, startDate, endDate };
      const res = await axios.post(publisherSubscriptionServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.services);
      setPublishers(res?.data?.publisher);

      let newService = { servicename: "All" };

      setServices((prevServices) => {
        // Inserting the new service at the first index
        return [newService, ...prevServices];
      });

      setService(newService?.servicename);

      let newPublisher = { partner: "All" };
      setPublishers((prevPublishers) => {
        // Inserting the new service at the first index
        return [newPublisher, ...prevPublishers];
      });
      setPublisher(newPublisher?.partner);

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

  // METHOD TO GET THE DATA ....
  async function fetchDataFromBackend(
    showLoading,
    dateStart,
    dateEnd,
    serviceName,
    publisherName
  ) {
    try {
      const client = localStorage.getItem("userName");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      let data = {};
      if (service == "All" || service == "") {
        data = {
          client,
          startDate: dateStart,
          endDate: dateEnd,
          service: "All",
          publisher: publisherName,
        };
      } else {
        data = {
          client,
          startDate: dateStart,
          endDate: dateEnd,
          service: serviceName,
          publisher: publisherName,
        };
      }
      if (showLoading) {
        setLoading("block");
      }
      // const data = { client, startDate, endDate };

      setIsRequestPending(true);

      const res = await axios.post(publisherSubscriptionApi, data, {
        headers: headers,
      });
      setData(res.data.data);
      setLoading("none");
      setIsRequestPending(false);
    } catch (error) {
      setIsRequestPending(false);
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
  }

  // GET THE SERVICES AND DATA INITIALLY..
  useEffect(() => {
    fetchServices();
    fetchDataFromBackend(true, startDate, endDate, service, publisher);
  }, []);

  // METHOD TO GET THE UPDATED DATA AFTER EVERY 10 SECONDS...
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden && !isRequestPending) {
        fetchDataFromBackend(null, startDate, endDate, service, publisher);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate, service, publisher, isRequestPending]);

  // METHOD TO HANDLE FORM SUBMISSION...
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

  // DATE CONVERSION METHODS...
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
        searchClickIdSubApi,
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
          <NewSidebar highlight={6} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          {hide ? null : (
            <NewHeader service="Publisher Subscription" highlight={6} />
          )}
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.servicename,
                    value: data?.servicename,
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
                    label: data?.partner,
                    value: data?.partner,
                  }))}
                  placeholder="Select a Partner"
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
              title="Publisher Subscription"
              icon={
                <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
              }
            />

            {data ? (
              <div className={classes.table_container}>
                <DataTable
                  value={data}
                  emptyMessage="No data found"
                  showGridlines
                  responsive
                  scrollable
                  scrollHeight="500px"
                  rows={15}
                  paginator
                >
                  <Column field="partner" header="Partner" />
                  <Column field="servicename" header="Service" />
                  <Column
                    field="queue"
                    header="Queue"
                    body={(rowData) =>
                      rowData.queue === undefined || rowData.queue === null
                        ? 0
                        : rowData.queue
                    }
                  />
                  <Column
                    field="sent"
                    header="Sent"
                    body={(rowData) =>
                      rowData.sent === undefined || rowData.sent === null
                        ? 0
                        : rowData.sent
                    }
                  />
                  <Column
                    field="skip"
                    header="Skip"
                    body={(rowData) =>
                      rowData.skip === undefined || rowData.skip === null
                        ? 0
                        : rowData.skip
                    }
                  />
                  <Column
                    field="duplicateRec"
                    header="Duplicate Record"
                    body={(rowData) =>
                      rowData.duplicateRec === undefined ||
                      rowData.duplicateRec === null
                        ? 0
                        : rowData.duplicateRec
                    }
                  />
                  <Column
                    field="total"
                    header="Total"
                    body={(rowData) =>
                      rowData.total === undefined || rowData.total === null
                        ? 0
                        : rowData.total
                    }
                  />
                </DataTable>
              </div>
            ) : null}
          </div>
        </div>
      </div>

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
                <Column field="servicename" header="Service" />
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
                        <p>{data?.clickId?.slice(0, 12)}...</p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.clickId);
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
                  header="Click Id"
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
                        <p>{data?.ext_id?.slice(0, 12)}...</p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(data?.ext_id);
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
                  header="Ext Ref"
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
                        <p>
                          {data?.partnercallbackUrl
                            ? `${data?.partnercallbackUrl?.slice(0, 12)}...`
                            : "Null"}
                        </p>
                        <IconButton
                          aria-label="copy"
                          size="small"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              data?.partnercallbackUrl
                            );
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
                  header="Partner Callback Url"
                />
                <Column
                  body={(data) => {
                    return (
                      <p>
                        {data?.isPending == 3
                          ? `Skip`
                          : data?.isPending == 1
                          ? `Queue`
                          : data?.isPending == 2
                          ? `Sent`
                          : `Duplicate`}
                      </p>
                    );
                  }}
                  header="Status"
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

export default PublisherSubscriptionPage;

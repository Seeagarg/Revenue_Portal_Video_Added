import React, { useState, useEffect } from "react";
import classes from "./DailyRevenuePage.module.css";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { addCountryAndOperator, fetchCountryAndOperator } from "../Data/Api";
import Loader from "../NewComponents/Loading-States/Loader";
import { toast, ToastContainer } from "react-toastify";
import NewSidebar from "../NewComponents/Sidebar/NewSidebar";
import NewHeader from "../NewComponents/Header/NewHeader";
import { InputText } from "primereact/inputtext";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// ADD COUNTRY AND OPERATOR PAGE...
const AddCountryAndOperatorPage = () => {
  const [country, setCountry] = useState("");
  const [operator, setOperator] = useState("");
  const [loader, setLoader] = useState("none");
  const [data, setData] = useState([]);

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  const client = localStorage.getItem("userName");

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  // GET THE DATA OF COUNTRY AND OPERATOR...
  const fetchDataFromBackend = async () => {
    try {
      setLoader("block");
      const data = { client };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(fetchCountryAndOperator, data, {
        headers: headers,
      });
      setData(response.data.data);
      setLoader("none");
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

  // METHOD TO HANDLE FORM SUBMISSION...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader("block");
    let token = localStorage.getItem("userToken");
    let headers = { Authorization: "Bearer " + token };
    const data = { country, operator, client };

    if (
      !country ||
      !operator ||
      operator.trim().length <= 0 ||
      country.trim().length <= 0
    ) {
      toast.error("Input Fields Cannot be Empty");
      setLoader("none");
      return;
    }
    try {
      const response = await axios.post(addCountryAndOperator, data, {
        headers: headers,
      });
      setLoader("none");
      setCountry("");
      setOperator("");
      toast.success("Country and Operator Added Successfully");
      fetchDataFromBackend();
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

  return (
    <div>
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
          <NewSidebar highlight={4} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service="All Services" highlight={4} />
          <div className={classes.sub_container}>
            <div className={classes.form_container}>
              <form onSubmit={handleSubmit}>
                <Box my={2}>
                  <InputText
                    type="text"
                    placeholder="Enter Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </Box>
                <Box my={2}>
                  <InputText
                    type="text"
                    placeholder="Enter Operator"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                  />
                </Box>

                <Box my={2}>
                  <Button type="submit" variant="contained">
                    Add
                  </Button>
                </Box>
              </form>
            </div>

            <TitleHeader
              title="Country and Operator"
              icon={<i className="fa-solid fa-globe" aria-hidden="true"></i>}
            />

            {data ? (
              <div className={classes.table_container}>
                <DataTable
                  value={data.map((row, index) => ({ ...row, id: index }))}
                  emptyMessage="No data found"
                  showGridlines
                  responsive
                  scrollable
                  scrollHeight="500px"
                  rows={15}
                  paginator
                >
                  <Column field="country_name" header="Country" />
                  <Column field="operator_name" header="Operator" />
                </DataTable>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCountryAndOperatorPage;

import React, { useContext, useState, useEffect } from "react";
import { EditModalContext } from "../../Context/Publisher-Modal-Context/EditPublisherModalContext";
import {
  TextField,
  Button,
  Modal,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import axios from "axios";
import {
  editAdvertiser,
  editPublisher,
  fetchCountryApi,
  fetchOperatorApi,
  fetchPublishersInAdvertiser,
  addPublisherInAdvertiser,
} from "../../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Loading-States/Loader";
import { EditAdvertiserContext } from "../../Context/Advertiser-Modal-Context/EditAdvertiserContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 100,
    label: "100",
  },
];

function valuetext(value) {
  return `${value}`;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "scroll",
  height: "90vh",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

const childStyle = {
  position: "absolute",
  overflowY: "scroll",
  height: "50vh",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

function ChildModal({ openChildModal, closeChildModal, getPublishers }) {
  const [publisher, setPublisher] = useState("");
  const handleClose = () => {
    closeChildModal();
  };
  const submitHandler = async () => {
    if (publisher.trim().length == 0) {
      toast.error("Input Fields cannot be empty!");
      return;
    }

    try {
      const data = { publisher };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(`${addPublisherInAdvertiser}`, data, {
        headers: headers,
      });

      setPublisher("");
      getPublishers();
      toast.success("Publisher added successfully!");
      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <Modal
        open={openChildModal}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={childStyle}>
          <h2 id="child-modal-title">Add New Publisher</h2>

          <Box my={2}>
            <TextField
              id="new-publisher"
              label="Enter Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              variant="outlined"
              sx={{ width: "100%" }}
            />
          </Box>

          <Box
            my={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Button variant="contained" color="primary" onClick={submitHandler}>
              Add
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const EditAdvertiserFormModal = (props) => {
  const { openEdit, closeEditHandler, id, data } = useContext(
    EditAdvertiserContext
  );
  const [client, setClient] = useState("");
  const [publisher, setPublisher] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [postbackUrl, setPostbackUrl] = useState("");
  const [operator, setOperator] = useState("");
  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [skip, setSkip] = useState("");
  const [dailyCap, setDailyCap] = useState("");
  const [publisherOptions, setPublisherOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [loading, setLoading] = useState("block");
  const [postbackUrlError, setPostbackUrlError] = useState(false);

  const [serviceUrlError, setServiceUrlError] = useState(false);

  const [openChildModal, setOpenChildModal] = useState(false);

  const closeChildModal = () => {
    setOpenChildModal(false);
  };

  const getPublishers = async () => {
    try {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(`${fetchPublishersInAdvertiser}`, null, {
        headers: headers,
      });
      setPublisherOptions(res?.data?.result);
    } catch (error) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  useEffect(() => {
    async function getCountryOptionsFromBackend() {
      try {
        setLoading("block");
        const client = localStorage.getItem("userName");
        const data = { client };
        let token = localStorage.getItem("userToken");
        let headers = { Authorization: "Bearer " + token };
        const response = await axios.post(fetchCountryApi, data, {
          headers: headers,
        });
        setCountryOptions(response.data.data);
        setLoading("none");
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            error?.response?.data?.message
        );
        setLoading("none");
      }
    }
    if (openEdit) {
      getPublishers();
      getCountryOptionsFromBackend();
    }
  }, [id, openEdit]);

  useEffect(() => {
    if (data[0]?.country && data[0]?.operator) {
      setClient(data[0]?.client_name);
      setPublisher(data[0]?.publisherName);
      setService(data[0]?.serviceName);
      setAmount(data[0]?.amount_per_sub);
      setServiceUrl(data[0]?.service_url);
      setPostbackUrl(data[0]?.postback_url);
      setCountry(data[0]?.country);
      setOperator(data[0]?.operator);
      setDailyCap(data[0]?.dailyCap);
      setSkip(data[0]?.skipBy);
      setPublisher(data[0]?.publisherName);
    }
  }, [id, data]);

  async function sendDataToBackend() {
    const data = {
      id,
      client,
      publisher,
      service,
      serviceUrl,
      postbackUrl,
      operator,
      country,
      amount,
      skip,
      dailyCap,
    };
    let token = localStorage.getItem("userToken");
    let headers = { Authorization: "Bearer " + token };
    try {
      await axios.post(`${editAdvertiser}`, data, { headers: headers });
      toast.success("Advertiser Edited successfully");
      setServiceUrlError(false);
      closeEditHandler();
      props.fetchDataFromBackend();
    } catch (error) {
      toast.error(error);
      closeEditHandler();
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      client.trim().length === 0 ||
      service.trim().length === 0 ||
      serviceUrl.trim().length === 0 ||
      postbackUrl.trim().length === 0 ||
      operator.trim().length === 0 ||
      country.trim().length === 0 ||
      publisher.trim().length === 0
    ) {
      toast.error("Input Fields cannot be empty !");
    }

    if (
      // serviceUrl.includes("ext_ref=<") ||
      // serviceUrl.includes("&bmgfy_transid=<") ||
      // serviceUrl.includes("bm_transid=<") ||
      // serviceUrl.includes("bmffy_transid=<") ||
      // serviceUrl.includes("bmkdz_transid=<") ||
      // serviceUrl.includes("aff_click_id=<") ||
      // serviceUrl.includes("sub_aff_id=<")
      serviceUrl.includes("<CLICK_ID>")
    ) {
      // if (postbackUrl.includes("tid=<")) {
      // let index = serviceUrl.indexOf("ext_ref=<");

      // let index2 = serviceUrl?.indexOf("&bmgfy_transid=<");
      // let index3 = serviceUrl?.indexOf("bm_transid=<");
      // let index4 = serviceUrl?.indexOf("bmffy_transid=<");
      // let index5 = serviceUrl?.indexOf("bmkdz_transid=<");
      // let index6 = serviceUrl?.indexOf("aff_click_id=<");
      // let index7 = serviceUrl?.indexOf("sub_aff_id=<");

      // let indexLast = serviceUrl.length;
      // const string = serviceUrl.substring(index + 9, indexLast - 1);

      // const string2 = serviceUrl?.substring(index2 + 9, indexLast - 1);
      // const string3 = serviceUrl?.substring(index3 + 9, indexLast - 1);
      // const string4 = serviceUrl?.substring(index4 + 9, indexLast - 1);
      // const string5 = serviceUrl?.substring(index5 + 9, indexLast - 1);
      // const string6 = serviceUrl?.substring(index6 + 9, indexLast - 1);
      // const string7 = serviceUrl?.substring(index7 + 9, indexLast - 1);

      // const checkLastCharacter = serviceUrl.substring(-1).includes(">");

      // const stringCheck = string.includes("CLICK_ID");

      // const stringCheck2 = string2.includes("CLICK_ID");
      // const stringCheck3 = string3.includes("CLICK_ID");
      // const stringCheck4 = string4.includes("CLICK_ID");
      // const stringCheck5 = string5.includes("CLICK_ID");
      // const stringCheck6 = string6.includes("CLICK_ID");
      // const stringCheck7 = string7.includes("CLICK_ID");

      // if (
      //   !stringCheck ||
      //   !checkLastCharacter ||
      //   string.trim() === "" ||
      //   !stringCheck2 ||
      //   !stringCheck3 ||
      //   !stringCheck4 ||
      //   !stringCheck5 ||
      //   !stringCheck6 ||
      //   !stringCheck7
      // ) {
      //   setServiceUrlError(true);
      //   toast.error("Wrong Url");
      //   return;
      // }

      if (!postbackUrl.includes("<CLICK_ID>")) {
        setPostbackUrlError(true);
        toast.error("Wrong Url");
        return;
      }

      sendDataToBackend();
    } else {
      setServiceUrlError(true);
      toast.error("Wrong Url");
    }
  };

  const handleChange = async (event) => {
    setCountry(event.target.value);
  };

  const handlePublisherChange = async (event) => {
    setPublisher(event.target.value);
  };

  useEffect(() => {
    if (country) {
      getOperatorOptionsFromBackend();
    }
  }, [country]);

  async function getOperatorOptionsFromBackend() {
    try {
      const client = localStorage.getItem("userName");
      const data = { client, country };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(fetchOperatorApi, data, {
        headers: headers,
      });
      setOperatorOptions(response.data.data);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || error?.response?.data?.message
      );
    }
  }

  const handleOpen = () => {
    setOpenChildModal(true);
  };

  return (
    <>
      <ToastContainer />

      <Modal
        open={openEdit}
        onClose={closeEditHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Loader value={loading} />
          {/* <Typography variant="h6">Open the Edit form again , if some data is empty!</Typography> */}
          <form onSubmit={submitHandler}>
            <Box my={2}>
              <TextField
                id="client"
                label="Client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="select-publisher">
                    Select Publisher
                  </InputLabel>
                  <Select
                    labelId="select-publisher"
                    id="select-publisher"
                    label="Select Publisher"
                    sx={{ width: "100%" }}
                    value={publisher}
                    onChange={handlePublisherChange}
                  >
                    {publisherOptions?.map((data, i) => {
                      return (
                        <MenuItem key={i} value={data?.publisherName}>
                          {data?.publisherName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <IconButton aria-label="add-publisher" onClick={handleOpen}>
                  <AddCircleIcon sx={{ color: "red" }} />
                </IconButton>
              </div>
            </Box>
            <Box my={2}>
              <TextField
                id="service"
                label="Service"
                value={service}
                variant="outlined"
                sx={{ width: "100%" }}
                onChange={(e) => setService(e.target.value)}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="amount"
                label="Amount Per Subscription"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="serviceUrl"
                label="Service Url"
                error={serviceUrlError}
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                variant="outlined"
                helperText={
                  serviceUrlError && "must-contain: ext_ref=<CLICK_ID>"
                }
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="postbackUrl"
                label="Postback Url"
                error={postbackUrlError}
                value={postbackUrl}
                onChange={(e) => setPostbackUrl(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
                helperText={postbackUrlError && "must-contain: <CLICK_ID>"}
              />
            </Box>
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel id="country-select-label">
                  Select Country
                </InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-simple-select"
                  label="Select Country"
                  sx={{ width: "100%" }}
                  value={country}
                  defaultValue={country}
                  onChange={handleChange}
                >
                  {countryOptions.map((data, i) => {
                    return (
                      <MenuItem key={i} value={data.country_name}>
                        {data.country_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel id="operator-select-label">
                  Select Operator
                </InputLabel>
                <Select
                  labelId="operator-select-label"
                  id="operator-simple-select"
                  label="Select Operator"
                  sx={{ width: "100%" }}
                  defaultValue={operator}
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  {operatorOptions?.map((data, i) => {
                    return (
                      <MenuItem key={i} value={data.operator}>
                        {data.operator}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              <TextField
                id="dailyCap"
                type="number"
                label="Daily Cap"
                InputProps={{
                  inputProps: {
                    min: 0, // Set your minimum value here
                  },
                }}
                value={dailyCap}
                onChange={(e) => setDailyCap(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>

            <Box my={2}>
              <Slider
                aria-label="Always visible"
                value={skip}
                onChange={(e) => setSkip(e.target.value)}
                getAriaValueText={valuetext}
                step={1}
                marks={marks}
                valueLabelDisplay="on"
              />
              <label>Skip {skip}</label>
            </Box>

            <Button
              type="submit"
              sx={{ width: "100%" }}
              variant="contained"
              color="secondary"
            >
              Save Changes
            </Button>
          </form>
          <ChildModal
            openChildModal={openChildModal}
            closeChildModal={closeChildModal}
            getPublishers={getPublishers}
          />
        </Box>
      </Modal>
    </>
  );
};

export default EditAdvertiserFormModal;

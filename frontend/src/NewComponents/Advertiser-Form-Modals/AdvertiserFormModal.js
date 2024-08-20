import React, { useContext, useState, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Box,
  Slider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../Loading-States/Loading";
import { AdvertiserModalContext } from "../../Context/Advertiser-Modal-Context/AdvertiserModalContext";
import {
  addPublisherInAdvertiser,
  advertiserApi,
  fetchCountryApi,
  fetchOperatorApi,
  fetchPublishersInAdvertiser,
} from "../../Data/Api";
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
  overflowY: "scroll",
  height: "90vh",
  top: "50%",
  left: "50%",
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

const AdvertiserFormModal = (props) => {
  const { open, closeHandler } = useContext(AdvertiserModalContext);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [postbackUrl, setPostbackUrl] = useState("");
  const [operator, setOperator] = useState("");
  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [publisher, setPublisher] = useState("");
  const [skip, setSkip] = useState(0);
  const [dailyCap, setDailyCap] = useState("");

  const [publisherOptions, setPublisherOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceUrlError, setServiceUrlError] = useState(false);
  const [postbackUrlError, setPostbackUrlError] = useState(false);

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
        // setLoading("block");
        const client = localStorage.getItem("userName");
        const data = { client };
        let token = localStorage.getItem("userToken");
        let headers = { Authorization: "Bearer " + token };
        const response = await axios.post(fetchCountryApi, data, {
          headers: headers,
        });
        setCountryOptions(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            error?.response?.data?.message
        );
        setLoading(false);
      }
    }
    if (open) {
      getPublishers();
      getCountryOptionsFromBackend();
    }
  }, [open]);

  const handleChange = async (event) => {
    setCountry(event.target.value);
    //hit api to fetch OPerators
  };

  const handlePublisherChange = async (event) => {
    setPublisher(event.target.value);
  };

  useEffect(() => {
    if (country) {
      getOperatorOptionsFromBackend();
      setOperator("");
    }
  }, [country]);

  async function getOperatorOptionsFromBackend() {
    try {
      // setLoading("block");
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

  async function sendDataToBackend() {
    try {
      setLoading(true);
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const data = {
        client,
        publisher,
        service,
        amount,
        serviceUrl,
        postbackUrl,
        skip,
        dailyCap,
        country,
        operator,
      };
      const response = await axios.post(`${advertiserApi}`, data, {
        headers: headers,
      });
      setClient("");
      setService("");
      setAmount("");
      setServiceUrl("");
      setPostbackUrl("");
      setSkip("");
      setDailyCap("");
      setCountry("");
      setOperator("");
      setPublisher("");
      setLoading(false);
      setServiceUrlError(false);
      toast.success("Advertiser Added Successfully...");
      props.fetchDataFromBackend();
      closeHandler();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || error?.response?.data?.message
      );
      setLoading(false);
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
      return;
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

      // const checkLastCharacter = serviceUrl?.substring(-1).includes(">");

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

  const handleOpen = () => {
    setOpenChildModal(true);
  };

  return (
    <>
      <ToastContainer />

      <Modal
        open={open}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                label="Service Name"
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
                error={serviceUrlError}
                label="Service Url"
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
                helperText={
                  serviceUrlError
                    ? "must-contain: <CLICK_ID>"
                    : "Sample: http://optin.telkomsdp.co.za/service/53?cid=700504&ext_ref=<CLICK_ID>"
                }
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
                id="dailycap"
                label="Daily Cap"
                type="number"
                variant="outlined"
                value={dailyCap}
                InputProps={{
                  inputProps: {
                    min: 0,
                  },
                }}
                onChange={(e) => setDailyCap(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>

            <Box my={2}>
              <Slider
                aria-label="Always visible"
                defaultValue={0}
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
              Submit
            </Button>
          </form>
          <ChildModal
            openChildModal={openChildModal}
            closeChildModal={closeChildModal}
            getPublishers={getPublishers}
          />
          {loading && <Loading />}
        </Box>
      </Modal>
    </>
  );
};

export default AdvertiserFormModal;

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
} from "@mui/material";
import axios from "axios";
import { addPublisher, fetchCountryApi, fetchOperatorApi } from "../../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Loading-States/Loader";
import Loading from "../Loading-States/Loading";
import classes from "./PublisherFormModal.module.css";
import { PublisherModalContext } from "../../Context/Publisher-Modal-Context/PublisherModalContext";

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
  width: "70%",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

const PublisherFormModal = ({ serviceName, id, fetchDataFromBackend }) => {
  const { open, closeHandler } = useContext(PublisherModalContext);
  const [client, setClient] = useState("");
  const [name, setName] = useState("");
  const [amount,setAmount]=useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [postbackUrl, setPostbackUrl] = useState("");
  const [operator, setOperator] = useState("");
  const [country, setCountry] = useState("");
  const [service, setService] = useState(serviceName);
  const [skip, setSkip] = useState(0);
  const [dailyCap, setDailyCap] = useState("");

  const [serviceUrlError, setServiceUrlError] = useState(false);
  const [postbackUrlError, setPostbackUrlError] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);
  const [loading, setLoading] = useState("block");

  useEffect(() => {
    let client = localStorage.getItem("userName");
    setClient(client);
  }, [serviceName]);

  useEffect(() => {
    setService(serviceName);
    // api hit here and get the country...
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
    getCountryOptionsFromBackend();
  }, [serviceName]);

  const countrySelectHandler = (e) => {
    e.preventDefault();
    // here hit the other api and get the operator and set the operators..
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      client.trim().length === 0 ||
      name.trim().length === 0 ||
      serviceUrl.trim().length === 0 ||
      postbackUrl.trim().length === 0 ||
      operator.trim().length === 0 ||
      country.trim().length === 0 ||
      service.trim().length === 0
    ) {
      toast.error("Input Fields cannot be empty !");
      return;
    }
    if (
      serviceUrl.includes("<CLICK_ID>") 
    ) {
      // let index = serviceUrl.indexOf("ext_ref=<");

      // let index2 = serviceUrl?.indexOf("&bmgfy_transid=<");
      // let index3 = serviceUrl?.indexOf("bm_transid=<");
      // let index4 = serviceUrl?.indexOf("bmffy_transid=<");
      // let index5 = serviceUrl?.indexOf("bmkdz_transid=<");

      // let indexLast = serviceUrl.length;
      // const string = serviceUrl.substring(index + 9, indexLast - 1);

      // const string2 = serviceUrl?.substring(index2 + 9, indexLast - 1);
      // const string3 = serviceUrl?.substring(index3 + 9, indexLast - 1);
      // const string4 = serviceUrl?.substring(index4 + 9, indexLast - 1);
      // const string5 = serviceUrl?.substring(index5 + 9, indexLast - 1);

      // const checkLastCharacter = serviceUrl?.substring(-1).includes(">");

      // const stringCheck = string.includes("CLICK_ID");
      // const stringCheck2 = string2.includes("CLICK_ID");
      // const stringCheck3 = string3.includes("CLICK_ID");
      // const stringCheck4 = string4.includes("CLICK_ID");
      // const stringCheck5 = string5.includes("CLICK_ID");

      if (
       !serviceUrl.includes("<CLICK_ID>")
      ) {
        setServiceUrlError(true);
        setPostbackUrlError(false);
        toast.error("Wrong Url");
        return;
      }

      const data = {
        id,
        client,
        name,
        amount:amount==""?0:amount,
        serviceUrl,
        postbackUrl,
        operator,
        country,
        service,
        skip,
        dailyCap,
      };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        setLoading("block");
        await axios.post(addPublisher, data, {
          headers: headers,
        });

        setClient("");
        setName("");
        setServiceUrl("");
        setPostbackUrl("");
        setOperator("");
        setCountry("");
        setService("");
        setSkip(0);

        setServiceUrlError(false);
        setPostbackUrlError(false);
        closeHandler();
        fetchDataFromBackend();
        setLoading("none");
        toast.success("Publisher Added successfully");
      } catch (error) {
        setLoading("none");
        toast.error(error);
        closeHandler();
      }
      // }
      // else {
      //   toast.error("Wrong Url");
      //   setPostbackUrlError(true);
      //   setServiceUrlError(false);
      // }
    } else {
      setServiceUrlError(true);
      setPostbackUrlError(false);
      toast.error("Wrong Url");
    }
  };

  const handleChange = async (event) => {
    setCountry(event.target.value);
    //hit api to fetch OPerators
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
      // setLoading("none");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || error?.response?.data?.message
      );
    }
  }

  return (
    <>
      <ToastContainer />

      {loading == "block" ? (
        <Loader value={loading} />
      ) : (
        <Modal
          open={open}
          onClose={closeHandler}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
          //  sx={style} 
          className={classes.modalStyle}>
            <form onSubmit={submitHandler}>
              <Box my={2}>
                <TextField
                  id="client"
                  label="Client"
                  value={client}
                  InputProps={{
                    readOnly: true,
                  }}
                  // onChange={(e) => setClient(e.target.value)}
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box my={2}>
                <TextField
                  id="name"
                  label="Publisher Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box my={2}>
                <TextField
                  id="amount"
                  type="number"
                  label="Amount Per Subscription (optional)"
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
                  helperText={
                    serviceUrlError
                      ? "must-contain: ext_ref=<CLICK_ID> or bm_transid=<CLICK_ID> or bmgfy_transid=<CLICK_ID>"
                      : "Sample: http://optin.telkomsdp.co.za/service/53?cid=700504&ext_ref=<CLICK_ID>"
                  }
                  // helperText={
                  //   "must-contain: ext_ref=<CLICK_ID>"
                  // }
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box my={2}>
                <TextField
                  id="postbackUrl"
                  error={postbackUrlError}
                  label="Postback Url"
                  value={postbackUrl}
                  onChange={(e) => setPostbackUrl(e.target.value)}
                  variant="outlined"
                  helperText={
                    postbackUrlError
                      ? "must-contain: ext_ref=<CLICK_ID>"
                      : "Sample: https://bmd.go2oh.net/postback?clickid=<CLICK_ID>"
                  }
                  sx={{ width: "100%" }}
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
                <TextField
                  id="service"
                  label="Service"
                  value={service}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
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
                disabled={loading == "block"}
              >
                Submit
              </Button>
            </form>
            {loading == "block" && <Loading />}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PublisherFormModal;

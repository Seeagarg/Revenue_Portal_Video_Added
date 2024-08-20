import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Switch, FormControlLabel, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import classes from "./ServicePage.module.css";
import PublisherFormModal from "../NewComponents/Publisher-Form-Modals/PublisherFormModal";
import axios from "axios";
import {
  deletePublisher,
  enableDisablePublisher,
  showPublisher,
} from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import EditPublisherFormModal from "../NewComponents/Publisher-Form-Modals/EditPublisherFormModal";
import { EditPublisherModalContext } from "../Context/Publisher-Modal-Context/EditPublisherModalContext";
import Loader from "../NewComponents/Loading-States/Loader";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DashboardPage from "./DashboardPage";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import { PublisherModalContext } from "../Context/Publisher-Modal-Context/PublisherModalContext";
import PublisherDummyHitModal from "../NewComponents/Publisher-Form-Modals/PublisherDummyHitModal";
import { PublisherDummyHitModalContext } from "../Context/Publisher-Modal-Context/PublisherDummyHitModalContext";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VideoModal from "../NewComponents/ShowVideo/VideoModal";


// SERVICE PAGE (ADD NETWORK PAGE...)
const ServicePage = () => {
  const [publisherData, setPublisherData] = useState();
  const [loader, setLoader] = useState("block");
  const { serviceName, id } = useParams();
  const [mainServiceId, setMainServiceId] = useState("");
  const [mainServiceName, setMainServiceName] = useState("");
  const { openHandler } = useContext(PublisherModalContext);
  const { openEditHandler } = useContext(EditPublisherModalContext);
  const { openInputHandler } = useContext(PublisherDummyHitModalContext);
  const [isShowPublisher, setIsShowPublisher] = useState(false);
  const [openVideo,setOpenVideo] = useState(false)

  const location = useLocation();

  // GET THE MAIN SERVICE ID AND NAME FROM LOCATION STATES GOT FROM DASHBOARD PAGE...
  useEffect(() => {
    setMainServiceId(location?.state?.mainServiceId);
    setMainServiceName(location?.state?.mainServiceName);
  }, [location]);

  // GET THE PUBLISHER DATA OF THAT SUB-SERVICE...
  useEffect(() => {
    fetchDataFromBackend();
    setIsShowPublisher(JSON.parse(localStorage.getItem("showAddPublisher")));
  }, [serviceName, id]);

  // METHOD TO GET THE PUBLISHER DATA OF SUB-SERVICE..
  const fetchDataFromBackend = async () => {
    setLoader("block");
    let token = localStorage.getItem("userToken");
    let headers = { Authorization: "Bearer " + token };
    try {
      //id send krni hai
      const response = await axios.post(
        `${showPublisher}?service=${serviceName}`,
        "",
        { headers: headers }
      );
      setPublisherData(response.data.data);
      setLoader("none");
    } catch (error) {
      if (error?.response?.status == 403) {
        throw new Error("Token Expired , Please Login Again!");
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            error?.data?.message
        );
      }
    }
  };

  // METHOD TO HANDLE DELETE...
  const handleDelete = async ({ id, name }) => {
    if (window.confirm(`Are you sure you want to delete publisher ${name}`)) {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        await axios.post(`${deletePublisher}?id=${id}`, "", {
          headers: headers,
        });

        toast.success("Publisher deleted successfully");
        fetchDataFromBackend();
      } catch (err) {
        if (err?.response?.status == 403) {
          toast.error(
            err?.response?.data?.message || err?.message || err?.data?.message
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          toast.error(
            err?.response?.data?.message || err?.message || err?.data?.message
          );
        }
      }
    }
  };

  // METHOD TO HANDLE ENABLE/DISABLE CHANGE...
  const handleChange = async (id, status) => {
    const data = { id, status: status == 1 ? 0 : 1 };
    try {
      // setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      await axios.post(enableDisablePublisher, data, { headers: headers });
      toast.success("Success");
      // setLoader("none");
      fetchDataFromBackend();
    } catch (error) {
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


  const handleCloseVideo=()=>{
    setOpenVideo(false);
  }



  return (
    <>
      <ToastContainer />
      <Loader value={loader} />
      <DashboardPage
        serviceName={serviceName}
        id={id}
        mainServiceId={mainServiceId}
        mainServiceName={mainServiceName}
      >
        {isShowPublisher ? (
          <>
            <TitleHeader title={serviceName} icon="" />

           <div className={classes.buttons}>
           <button onClick={openHandler} className={classes.add_btn}>
              Add Publisher
              <AddIcon />
            </button>
            <button onClick={()=>setOpenVideo(true)} className={classes.show_btn}>
              Show Video
              <OndemandVideoIcon/>
            </button>
           </div>
            {publisherData?.length <= 0 ? (
              <Button>No Data</Button>
            ) : (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <table className={classes.table}>
                    <tbody>
                      <tr className={classes.tr_th}>
                        <th className={classes.th}>Client</th>
                        <th className={classes.th}>Name</th>
                        <th className={classes.th}>Amount Per Subscription</th>
                        <th className={classes.th}>Service Url</th>
                        <th className={classes.th}>Postback Url</th>
                        <th className={classes.th}>Promotion Url</th>
                        <th className={classes.th}>Operator</th>
                        <th className={classes.th}>Country</th>
                        <th className={classes.th}>Service</th>
                        <th className={classes.th}>Skip</th>
                        <th className={classes.th}>Daily Cap</th>
                        <th className={classes.th}>Edit</th>
                        <th className={classes.th}>Delete</th>
                        <th className={classes.th}>Enable/Disable</th>
                        <th className={classes.th}>Dummy Hit</th>
                      </tr>

                      {publisherData?.map((data) => {
                        return (
                          <tr className={classes.tr} key={data.id}>
                            <td className={classes.td}>{data.client}</td>
                            <td className={classes.td}>{data.name}</td>
                            <td className={classes.td}>{data.amount}</td>
                            <td
                              className={classes.td}
                              style={{ width: "100%" }}
                            >
                              {data.serviceUrl}
                            </td>
                            <td
                              className={classes.td}
                              style={{ width: "100%" }}
                            >
                              {data.postbackUrl}
                            </td>
                            <td
                              className={classes.td}
                              style={{ width: "100%" }}
                            >
                              {data.promotionUrl}
                              <IconButton
                                aria-label="copy"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    data.promotionUrl
                                  );
                                }}
                              >
                                <ContentCopyIcon
                                  sx={{ color: "#696CFF" }}
                                  fontSize="small"
                                />
                              </IconButton>
                            </td>
                            <td className={classes.td}>{data.operator}</td>
                            <td className={classes.td}>{data.country}</td>
                            <td className={classes.td}>{data.service}</td>
                            <td className={classes.td}>{data.skipValue}</td>
                            <td className={classes.td}>{data?.dailyCap}</td>
                            <td className={classes.td}>
                              <Button
                                variant="contained"
                                onClick={() => openEditHandler(data.id)}
                              >
                                Edit
                              </Button>
                            </td>
                            <td className={classes.td}>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleDelete({
                                    id: data.id,
                                    name: data.name,
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </td>
                            <td className={classes.td}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={data.status === 1}
                                    onChange={() =>
                                      handleChange(data.id, data.status)
                                    }
                                  />
                                }
                                label="Enable"
                              />
                            </td>
                            <td className={classes.td}>
                              <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={() =>
                                  openInputHandler({
                                    postbackUrl: data.postbackUrl,
                                    service: data.service,
                                    partnerName: data.name,
                                  })
                                }
                              >
                                Hit
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <PublisherFormModal
              serviceName={serviceName}
              id={id}
              fetchDataFromBackend={fetchDataFromBackend}
            />
            <EditPublisherFormModal
              fetchDataFromBackend={fetchDataFromBackend}
            />
            <PublisherDummyHitModal
              fetchDataFromBackend={fetchDataFromBackend}
            />
            <VideoModal openModal={openVideo} close={handleCloseVideo} />
          </>
        ) : null}
      </DashboardPage>
    </>
  );
};

export default ServicePage;

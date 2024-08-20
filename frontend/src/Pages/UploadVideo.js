import React,{useState,useEffect,useCallback} from 'react'
import classes from "./UploadVideo.module.css";
import NewSidebarAdmin from '../NewComponents/Sidebar/NewSidebarAdmin';
import { Dropdown } from "primereact/dropdown";
import NewHeaderAdmin from "../NewComponents/Header/NewHeaderAdmin";
import TitleHeader from "../NewComponents/Header/TitleHeader";
import axios from "axios";
import {
    fetchClientServices,
    fetchClientSubServicesApi,
    getServiceFlowVideoApi,
    uploadServiceFlowVideoApi,
  } from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../NewComponents/Loading-States/Loader";
import Lottie from 'lottie-react'
import upload from '../Animations/Upload.json'
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
import { FaCloudUploadAlt } from 'react-icons/fa';
// import { Line } from 'rc-progress';
import ProgressBar from "@ramonak/react-progress-bar";



const UploadVideo = () => {

    const [loader, setLoader] = useState("block");
    const [videoPreview, setVideoPreview] = useState(null);
    // const [data, setData] = useState([]);



    const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [clientForDropdown, setClientForDropdown] = useState("");

  const [subServices, setSubServices] = useState([]);
  const [subService, setSubService] = useState("");
  const [services, setServices] = useState([]);
  const [service, setService] = useState("");
  const [responseService, setResponseService] = useState("");

  const [subServiceId,setSubServiceId] = useState('');
  const [subServiceName,setSubServiceName] = useState('');
  const [selectedFile,setSelectedFile] = useState('');

  const [progress, setProgress] = useState(0);

  const [video,setVideo] = useState('')

  console.log(subServiceId)


  const [existingVideo,setExistingVideo] = useState(false);


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

  useEffect(()=>{
    fetchServiceFlowVideo(subServiceId,subService);
  },[subServiceId])

  // console.log(subServiceId,'-------------------')



  async function gettingClientServices(clientId, countryName) {
    try {
      setLoader("block");
      //fetch Services of that client and store in localStorage;
      // gettingServices() function call;

      

      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(
        `${fetchClientServices}?clientId=${clientId}`,
        null,
        {
          headers: headers,
        }
      );
      localStorage.setItem("services", JSON.stringify(res?.data?.data));
      gettingServices(countryName);
    } catch (error) {
    //   setLoader("none");
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


  const gettingServices = (countryName) => {
    let services2 = JSON.parse(localStorage.getItem("services"));
    let filteredServices = services2.filter(
      (data) => data?.country == countryName
    );
    setServices(filteredServices);
    setService(filteredServices[0].serviceName)
    setResponseService(filteredServices[0].serviceName)
    fetchSubServices(filteredServices[0].id)
    
  };


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
      console.log(response,'================')

      localStorage.setItem('sub_services',JSON.stringify(response?.data?.data?.dataArray))
      setSubServices(response?.data?.data?.dataArray);
      setSubService(() => response?.data?.data?.dataArray[0]?.subServiceName);
      setSubServiceId(()=>response?.data?.data?.dataArray[0]?.serviceId)
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




    const [sidebarHide, setSidebarHide] = useState(() =>
        localStorage.getItem("sidebar")
          ? JSON.parse(localStorage.getItem("sidebar"))
          : false
      );

      const sidebarHandler = () => {
        localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
        setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
      };


      const handleClientChange = (client) => {
        setSubServiceId('')
        setSubServiceName('')
        setVideo('')
        setExistingVideo(false)
        setVideoPreview('')
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
        setSubServiceId('')
        setSubServiceName('')
        setVideo('')
        setExistingVideo(false)
        setVideoPreview('')
        setCountry(selectedCountry);
        let services2 = JSON.parse(localStorage.getItem("services"));
        let filteredServices = services2.filter(
          (data) => data?.country == selectedCountry
        );
        
        setServices(filteredServices);
        setService(filteredServices[0].serviceName)
        setResponseService(filteredServices[0].serviceName)
        fetchSubServices(filteredServices[0].serviceId)
        
      };

      const handleServiceChange = (service) => {
        setSubServiceId('')
        setSubServiceName('')
        setVideo('')
        setExistingVideo(false)
        setLoader("block");
        setVideoPreview('')
        setService(service)
        setResponseService(service)
        let services2 = JSON.parse(localStorage.getItem("services"));
        // console.log(services2)

        let filteredServices = services2.filter(
            (data) => data?.serviceName == service
          );

        fetchSubServices(filteredServices[0].id);
      };

      

      const handleSubServiceChange = (selectedSubService) => {
        setVideo('')
        setExistingVideo(false)
        setVideoPreview('')
        setSubService(selectedSubService)
        const subServices2 = JSON.parse(localStorage.getItem('sub_services'));
        const filteredSubService = subServices2.filter((item)=>item.subServiceName == selectedSubService);
        console.log(filteredSubService,'filter')
        setSubServiceId(filteredSubService[0].serviceId);
        setSubServiceName(filteredSubService[0].subServiceName)

        fetchServiceFlowVideo(filteredSubService[0].serviceId,filteredSubService[0].subServiceName)
      };

      const fetchServiceFlowVideo=async(serviceId,serviceName)=>{
        setVideoPreview('')
        const data = {
          subServiceId : serviceId,
          subServiceName:serviceName
        }

        let token = localStorage.getItem("userToken");

        let headers = { Authorization: "Bearer " + token };

        const res = await axios.post(getServiceFlowVideoApi,data,{
          headers:headers
        })
        if(res.data.result.length != 0){
          setVideo(res?.data?.result[0].videoUrl)
          setExistingVideo(true)
          console.log(res.data.result.length,'dfxghjk')
        }
        else{
          setVideo('')
          console.log(video)
        }
        console.log(res)
      }

      



    const handleBtn=async(e)=>{

      if(subServiceId == ''){
        toast.warn('Please select Sub-Service!!')
        return ;
      }
        const input = document.getElementById('input').click()
      
    }

    console.log(selectedFile)

    const handleUpload=async()=>{
       if(subServiceId == '' || subServiceId == '0'){
        toast.warn('Please select Sub-Service!!')
        return ;
      }

      // const subServices2 = JSON.parse(localStorage.getItem('sub_services'));
      // const filteredSubService = subServices2.filter((item)=>item.serviceId == subServiceId);

      console.log(subServiceName,'===============',selectedFile);

      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };

      if(selectedFile){
        const filedata = new FormData();
      
        filedata.append("file",selectedFile)
        filedata.append("subServiceName",subServiceName || subService)
        filedata.append("subServiceId",subServiceId)

        try{
          const res = await axios.post(uploadServiceFlowVideoApi,
            filedata,
            {
              headers:headers,
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgress(percentCompleted)
            }
            },
           
          )
  
            console.log(res)
            toast.success(res.data.message)
        }
        catch(err){
          console.log(err)
          toast.error(err.message)
        }

        fetchServiceFlowVideo(subServiceId,subServiceName || subService)
      }
      console.log(subServiceId)
    }

    console.log(progress,'progress')


    const onDrop = useCallback((acceptedFiles) => {
      
      
      if (acceptedFiles.length > 0) {
          const file = acceptedFiles[0];
          setSelectedFile(file);
          if (file.type.startsWith('video/')) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  setVideoPreview(reader.result);
              };
              reader.readAsDataURL(file);
          } else {
              toast.warn('Please select a valid video file');
          }
      }
  }, []);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: 'video/*',
      multiple: false
  });



  return (
   <>
    {/* <Loader value={loader} > */}
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
          <NewSidebarAdmin highlight={4} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeaderAdmin service={responseService} highlight={2} />
          <div className={classes.sub_container}>
            <form className={classes.form}>
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
            </form>

            <TitleHeader title={existingVideo ? 'Video' : 'Upload'} icon="" />

            {
              !existingVideo ?
              <>
            <div className={classes.upload}>
            {
                videoPreview?
        <>
       
       <div className={classes.review}>
       <ProgressBar completed={progress} 
       className={classes.progressBar}
      height='5px'
      borderRadius='none'
      width='100%'
      isLabelVisible={false}
      bgColor	='green'
        />
       <ReactPlayer url={videoPreview}
                    controls
                    width="100%"
                    height="90%"
                    className={classes.player}  />
        <button className={classes.btn_another} onClick={()=>setVideoPreview("")}><i class="fa-solid fa-plus"></i> Select Another</button>
       </div>
        </>
        :
        <>
            <div className={classes.dragdropContainer}>
            <div
                {...getRootProps()}
                className={`${classes.dropzone} ${isDragActive ? classes.active : ''}`}
            >
                <input id='input' {...getInputProps()} />
                <FaCloudUploadAlt size={50} />
                <p>{isDragActive ? 'Drop the video file here...' : 'Drag & drop a video file here, or click to select a video file'}</p>
            </div>
              </div>
              <div>OR</div>
              <div className={classes.btn_container}>
                <button className={classes.btn_another} onClick={handleBtn}> <i class="fa-solid fa-plus"></i> SELECT A VIDEO</button>
              </div>
            </>
            }
           
            </div>
            <div className={classes.upload_btn_container}>
            <button className={classes.upload_btn} onClick={handleUpload}>upload</button>
            </div>
            </>
            :
            <>
            <div className={classes.review}>
       <ReactPlayer url={video}
                    controls
                    width="100%"
                    height="90%"
                    className={classes.player} 
                    style={{backgroundColor:"#e7e7e7"}}
                     />
                   
       {/* <div className={classes.btns}>
       <button className={classes.btn_another} ><i class="fa-solid fa-plus"></i>Edit</button>
       <button className={classes.btn_another} ><i class="fa-solid fa-plus"></i>Delete</button>
       </div> */}
       </div>
            </>
              
            }

            
          </div>
        </div>
      </div>
   </>
  )
}

export default UploadVideo

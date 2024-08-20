import React,{useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useParams} from 'react-router-dom';
import { getServiceFlowVideoApi } from '../../Data/Api';
import axios from 'axios';
import classes from './VideoModal.module.css'
import ReactPlayer from 'react-player';
import Lottie from 'lottie-react'
import noVideo from '../../Animations/noVideo.json'



// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 1000,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   };

const VideoModal = ({openModal,close}) => {


    const {id,serviceName} = useParams();
    console.log(id,'----',serviceName)

    const [video,setVideo] = useState('');

    const fetchVideo=async()=>{

        const data = {
            subServiceId : id,
            subServiceName:serviceName
          }
  
          let token = localStorage.getItem("userToken");
  
          let headers = { Authorization: "Bearer " + token };

        const res = await axios.post(getServiceFlowVideoApi,data,{
            headers:headers
        })

        if(res.data.result.length != 0){
            setVideo(res?.data?.result[0].videoUrl)
            console.log(res.data.result.length,'dfxghjk')
          }
          else{
            setVideo('')
            console.log(video)
          }

    }

    useEffect(() => {
        fetchVideo() 
    }, [id])


  return (
       <Modal
        open={openModal}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.container}>
        {/* <Typography  id="modal-modal-title" variant="h5" style={{fontWeight:'600'}} component="h2" > SERVICE FLOW VIDEO</Typography> */}
         <div className={classes.top}>
         <Typography id="modal-modal-title" variant="h6" style={{fontWeight:'600'}} component="h2">
            {serviceName}
          </Typography>
          <button onClick={close} className={classes.close_btn}>
            Close
          </button>
         </div>
        {
          video ?
          <div className={classes.player}>
          <ReactPlayer
          url={video}
          controls
                    width="100%"
                    height="90%"
          />
          </div>
          :
          <div className={classes.text}>
          <Lottie
            animationData={noVideo}
            className={classes.animation}
          />

            No Video Uploaded Yet!!
          </div>
        }
        </Box>
      </Modal>
  )
}

export default VideoModal

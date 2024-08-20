//Get Monthly Revenue

import axios from "axios";

const GetSecure=async(url)=>{

    //url=Data/Api-sendMonthlyDataApi

    let token=localStorage.getItem("userToken");
    let headers={"Authorization":"Bearer "+token};

    let sendResponse;
    await axios.get(url,{headers:headers}).then(
        (response)=>{
            sendResponse=response.data;
        },
        (error)=>{
            // console.log("error ",error);
            // sendResponse={"response":"3"};
            sendResponse={"response":"error","error":error};
        }
    )
        return sendResponse
}
export default GetSecure;
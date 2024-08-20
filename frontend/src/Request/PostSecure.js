//Getting daily revenue

import axios from "axios";

const PostSecure=async(url,request)=>{

    //url= Data/Api-SendDataApi
    //request= date and serviceName
    let token=localStorage.getItem("userToken");
    let headers={"Authorization":"Bearer "+token};

    let sendResponse;
    await axios.post(url,request,{headers:headers}).then(
        (response)=>{
            sendResponse=response.data;
        },
        (error)=>{
            // sendResponse={"response":"3"};
            sendResponse={"response":"error","error":error};
        }
    )
        return sendResponse
}
export default PostSecure;
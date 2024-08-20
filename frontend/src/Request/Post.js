// Login Post Request

import axios from "axios";

const Post = async (url, request) => {
  //request={email,password}
  //url=loginApi from Data/Api

  let sendResponse;

  await axios.post(url, request).then(
    (response) => {
      sendResponse = response.data;
    },
    (error) => {
      // console.log("error ",error);
      // return error
      sendResponse = { response: "error", error: error };
      // sendResponse={"response":"3"};
    }
  );
  return sendResponse;
};
export default Post;

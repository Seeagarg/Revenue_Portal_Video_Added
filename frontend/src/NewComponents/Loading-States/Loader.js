import React,{useContext} from "react";
import {ThreeDots } from "react-loader-spinner";

const Loader=(value)=>{
  return (
    <div className="loading-div" style={{display:`${value.value}`}}>
      <div
        className="three-dots-div"
        style={{ position: "absolute", top: "50%", left: "50%",zIndex:300 }}
      >
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="black"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    </div>
  );
};
export default Loader;
import { createContext, useState } from "react";

export const AdvertiserDummyHitContext = createContext({
  openInput: false,
  postbackUrl:"",
  service:"",
  partnerName:"",
  openInputHandler: () => {},
  closeInputHandler: () => {},
});

const AdvertiserDummyHitProvider = ({ children }) => {
  const [openInput, setOpenInput] = useState(false);
const [postbackUrl,setPostbackUrl]=useState("");
const [service,setService]=useState("");
const [partnerName,setPartnerName]=useState("");
  const openInputHandler = (data) => {
    setOpenInput(true);
    setPostbackUrl(data.postbackUrl);
    setService(data.service);
    setPartnerName(data.clientName);
};
  const closeInputHandler = () => {
    setOpenInput(false);
    setPostbackUrl("");
    setService("");
    setPartnerName("");
  };
  const value = { openInput,openInputHandler, closeInputHandler,postbackUrl,service,partnerName };
  return (
    <AdvertiserDummyHitContext.Provider value={value}>
      {children}
    </AdvertiserDummyHitContext.Provider>
  );
};
export default AdvertiserDummyHitProvider;

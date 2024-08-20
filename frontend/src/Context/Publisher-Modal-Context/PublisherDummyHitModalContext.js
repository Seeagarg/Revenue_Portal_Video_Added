import { createContext, useState } from "react";

export const PublisherDummyHitModalContext = createContext({
  openInput: false,
  postbackUrl:"",
  service:"",
  partnerName:"",
  openInputHandler: () => {},
  closeInputHandler: () => {},
});

const PublisherDummyHitModalContextProvider = ({ children }) => {
  const [openInput, setOpenInput] = useState(false);
const [postbackUrl,setPostbackUrl]=useState("");
const [service,setService]=useState("");
const [partnerName,setPartnerName]=useState("");
  const openInputHandler = (data) => {
    setOpenInput(true);
    setPostbackUrl(data.postbackUrl);
    setService(data.service);
    setPartnerName(data.partnerName);
};
  const closeInputHandler = () => {
    setOpenInput(false);
    setPostbackUrl("");
    setService("");
    setPartnerName("");
  };
  const value = { openInput,openInputHandler, closeInputHandler,postbackUrl,service,partnerName };
  return (
    <PublisherDummyHitModalContext.Provider value={value}>
      {children}
    </PublisherDummyHitModalContext.Provider>
  );
};
export default PublisherDummyHitModalContextProvider;

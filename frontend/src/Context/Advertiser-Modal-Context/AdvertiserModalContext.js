import { createContext ,useState} from "react";

export const AdvertiserModalContext=createContext({
    open:false,
    openHandler:()=>{},
    closeHandler:()=>{}
});

const AdvertiserModalProvider=({children})=>{
    const [open,setOpen]=useState(false);
    const openHandler=()=>{
        setOpen(true)
    }
    const closeHandler=()=>{
        setOpen(false);
    }
    const value={open,openHandler,closeHandler}
    return <AdvertiserModalContext.Provider value={value}>{children}</AdvertiserModalContext.Provider>
}
export default AdvertiserModalProvider;
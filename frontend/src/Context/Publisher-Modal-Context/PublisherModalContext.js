import { createContext ,useState} from "react";
// MODAL CONTEXT , MODAL PROVIDER .

export const PublisherModalContext=createContext({
    open:false,
    openHandler:()=>{},
    closeHandler:()=>{}
});

const PublisherModalContextProvider=({children})=>{
    const [open,setOpen]=useState(false);
    const openHandler=()=>{
        setOpen(true)
    }
    const closeHandler=()=>{
        setOpen(false);
    }
    const value={open,openHandler,closeHandler}
    return <PublisherModalContext.Provider value={value}>{children}</PublisherModalContext.Provider>
}
export default PublisherModalContextProvider;
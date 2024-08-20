import { createContext, useState } from "react";

export const EditAdvertiserContext = createContext({
  openEdit: false,
  id:0,
  data:[],
  openEditHandler: () => {},
  closeEditHandler: () => {},
});

const EditAdvertiserProvider = ({ children }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [id,setId]=useState(0);
  const [data,setData]=useState([]);
  const openEditHandler = (id,gotData) => {
    setOpenEdit(true);
    setData(()=>gotData.filter((value)=>value?.id==id));
    setId(id)
  };
  const closeEditHandler = () => {
    setOpenEdit(false);
  };
  const value = { openEdit, id,data,openEditHandler, closeEditHandler };
  return (
    <EditAdvertiserContext.Provider value={value}>
      {children}
    </EditAdvertiserContext.Provider>
  );
};
export default EditAdvertiserProvider;

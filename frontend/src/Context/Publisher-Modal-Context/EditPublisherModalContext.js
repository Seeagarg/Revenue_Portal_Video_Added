import { createContext, useState } from "react";

export const EditPublisherModalContext = createContext({
  openEdit: false,
  id:0,
  openEditHandler: () => {},
  closeEditHandler: () => {},
});

const EditPublisherModalContextProvider = ({ children }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [id,setId]=useState(0);
  const openEditHandler = (id) => {
    setOpenEdit(true);
    setId(id)
  };
  const closeEditHandler = () => {
    setOpenEdit(false);
  };
  const value = { openEdit, id,openEditHandler, closeEditHandler };
  return (
    <EditPublisherModalContext.Provider value={value}>
      {children}
    </EditPublisherModalContext.Provider>
  );
};
export default EditPublisherModalContextProvider;

import { useContext } from "react";
import { LoginContext } from "../context/AuthContext";
import { LoginContextType } from "../types/LoginTypes";


export default (): LoginContextType => {
  const context = useContext<LoginContextType>(LoginContext)

  return context
}

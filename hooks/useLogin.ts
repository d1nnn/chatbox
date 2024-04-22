import { useContext } from "react";
import { LoginContext } from "../context/AuthContext";
import { GlobalContextType } from "../types/GlobalTypes";
import { AuthType } from "../types/UserTypes";


export default (): GlobalContextType<AuthType> => {
  const context = useContext<GlobalContextType<AuthType>>(LoginContext)

  return context
}

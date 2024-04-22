import { useContext } from "react"
import { GroupsContext } from "../context/GroupsContext"
import { GlobalContextType } from "../types/GlobalTypes"
import { GroupType } from "../types/GroupTypes"



export default (): GlobalContextType<GroupType[]> => {
  const context = useContext<GlobalContextType<GroupType[]>>(GroupsContext)

  return context
}

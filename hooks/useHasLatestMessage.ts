import { useContext } from "react"
import { LatestMessageContext, LatestMessageContextType } from "../context/LatestMessageContext"


export default function useHasLatestMessage(): LatestMessageContextType {
  let context = useContext(LatestMessageContext)

  return context
}

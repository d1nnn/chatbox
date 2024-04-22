import React, { Dispatch, ReactNode, createContext, useState } from "react";

type LatestMessageProviderType = {
  children: ReactNode
}

export type LatestMessageContextType = {
  hasLatestMessage: boolean,
  handleLatestMessage: Dispatch<any>
}

const initialState = true

export const LatestMessageContext = createContext<LatestMessageContextType>({ hasLatestMessage: initialState, handleLatestMessage: () => null })

export default function LatestMessageProvider({ children }: LatestMessageProviderType): React.JSX.Element {
  const [hasLatestMessage, setHasLatestMessage] = useState<boolean>(initialState)


  return (
    <LatestMessageContext.Provider value={{ hasLatestMessage, handleLatestMessage: setHasLatestMessage }}>
      {children}
    </LatestMessageContext.Provider>
  )
}

import { useContext } from "react";
import { GlobalContextType } from "../types/GlobalTypes";
import { UserType } from "../types/UserTypes";
import { UsersContext, UserContext } from "../context/UsersContext";



export enum UserCtx {
  UserType,
  UsersType
}

export default function useUsers(type: UserCtx): GlobalContextType<UserType> | GlobalContextType<UserType[]> {

  if (type === UserCtx.UsersType)
    return useContext<GlobalContextType<UserType[]>>(UsersContext)
  else
    return useContext<GlobalContextType<UserType>>(UserContext)

}

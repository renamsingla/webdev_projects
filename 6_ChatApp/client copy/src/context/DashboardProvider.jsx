import React, { createContext, useContext, useEffect, useState } from "react"
import { io } from 'socket.io-client'
import useAuth from "./authProvider";
import auth from '../lib/auth'

const dashboardContext= createContext();

export const DashboardProvider= ({children})=>{

    const {user, token}= useAuth();
    const[socket, setSocket]=useState(null);
    const[isConnected, setIsConnected]= useState(false);
    

    useEffect(()=>{
        if(!token) return;
        //this is the bundle that server send to frontend, and to connect we ned to call io
        const socket= io("http://localhost:4441",{
         auth:{
                 token: `${auth.token}`
               }
        })
    
        socket.on("connect",()=>{
          console.log("user connected")
        })
    
        setSocket(socket);
        setIsConnected(true);
    
        return()=>{
          setIsConnected(false);
          socket.disconnect()
        }
      },[token])


    return(
        <dashboardContext.Provider value={{socket, isConnected}}  >
            {children}
        </dashboardContext.Provider>
    )
}

export default function useApp(){
    return useContext(dashboardContext);
}
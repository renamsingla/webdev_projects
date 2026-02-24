import { createContext, useContext, useState, useRef, useEffect } from "react"
import useAuth from "./authProvider";
import useApp from "./DashboardProvider";
import Groupapi from "../api/Groupapi";

const GroupContext= createContext();

export const GroupProvider=({children})=>{

    const {isConnected, socket}= useApp();
    const {token, user}= useAuth();

    // const[existingGrpId, setExistingGrpId]= useState("")
    // const[grpMessages, setGrpMessages]= useState("")

    const[currentGrpId, setCurrentGrpId]= useState("");
    const groupName= useRef("");
    const[text, setText]= useState("");
    // to show the message on side D
    const[grpText, setGrpText]= useState([])

    const[addGroup, setAddGroup]= useState(false);

    const createGroup= useRef();
    const existingGrpId=useRef();

    useEffect(()=>{
        if (!socket) return;
        if(!currentGrpId)return;
        
        const handler= (data)=>{
            console.log(data);
            if(currentGrpId==data.groupId){
              setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
            }
        }

        socket.on("grp:new",handler)
        // socket.on("grp:new",(data)=>{
        //   setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
        // })

        return () => {
            socket.off("grp:new", handler);  // remove this EXACT handler
        };

    },[socket,currentGrpId])


    async function GroupList() {
        const {data}= await Groupapi.getAllGroups();
        console.log(data);
        return data;
    }

    async function GroupMessageList() {
    console.log("in GroupMessageList")
        const {data}= await Groupapi.getGroupMessages(currentGrpId);
        console.log(data);
        return data;
    }

    const groupHandler= function(){
        socket.emit("grp:send",{
          existingGrpId:currentGrpId,
          grpMessages:text
        },(msg)=>{
          if(!msg.ok){
            console.log(msg.error)
            return alert (msg.error);
          }
          console.log("new mesg:" ,msg.message.senderId);
          console.log("new mesg:" ,msg.message.text);
          setText("");
        })
      }
    
      const createGrpHandler=async function(){
        const grpName= createGroup.current.value;
        const userId= user.id;
        const data= await Groupapi.createGroup(grpName, userId);
        setAddGroup(prev => !prev);
      }
    
      const addGrpHandler=async function(){
        const groupId= existingGrpId.current.value;
        const userId= user.id;
        const data= await Groupapi.addGroup(groupId,userId);
        setAddGroup(prev => !prev);
        // axios.post('/api/group/add',{
        //   groupId,
        //   userId: user.id
        // }).then(({data})=>{
        //   setGroupList(prev=>[...prev,data])
        //   console.log(data);
        // }).catch(error=>{
        //   console.log(error)
        // })
      }
    


    return(
        <GroupContext.Provider value={{
            GroupList,
            currentGrpId,
            setCurrentGrpId,
            groupName,
            grpText,
            setGrpText,
            GroupMessageList,
            text,
            setText,
            groupHandler,
            addGroup,
            createGroup,
            createGrpHandler,
            existingGrpId,
            addGrpHandler
        }}>
            {children}
        </GroupContext.Provider>
    )
}

export default function useGroup(){
    return useContext(GroupContext)
}
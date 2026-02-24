import React , { createContext, useContext, useEffect, useRef, useState } from "react"
import useAuth from "./authProvider";
import useApp from "./DashboardProvider";
import DMApi from "../api/DMapi";

const DMContext= createContext();
export const DMProvider=({children})=>{
    const {isConnected, socket}= useApp();
        
    const {token, user}= useAuth();
    // input boxes
    const[receiverId, setReceiverId]= useState("");
    const[text, setText]= useState("");

    const[friendshipId, setFriendshipId]= useState("");
    

    // to show the message on side B
    const[messages, setMessage]= useState([]);

    const friendName= useRef("");

 
    const[addFriend, setAddFriend]= useState(false);

    const addText= useRef();
    const addReceiverId= useRef();

    useEffect(()=>{
        if (!socket) return;
        if(!receiverId)return;
        
        socket.on("chat:new",(data)=>{
            console.log(data);
            console.log(user.id)
            console.log(data.receiverId)
            console.log(receiverId)
            console.log(data.message)
            console.log(data.message.senderId)

            if(user.id==data.message.senderId && receiverId==data.receiverId){ 
                //sender interface
                setMessage((prevmsgs)=>[...prevmsgs,data.message])
                
            }else{
                if(user.id==data.receiverId && receiverId==data.message.senderId){ 
                    //receiver interface
                    setMessage((prevmsgs)=>[...prevmsgs,data.message])
                }else{ 
                    //casual msg
                    console.log("new frindship")
                    setAddFriend(prev => !prev);
                }
            }
        })

        return()=>{
            socket.off("chat:new")
        }
    },[socket,receiverId])

    async function FriendList() {
        const data= await DMApi.getFriendList();
        console.log(data);
        return data;
    }

    async function MessageList(){
        if(!friendshipId)return;
        const data= await DMApi.getMessages(friendshipId);
        console.log(data);
        return data;
    }


    const chatHandler= function(){
        socket.emit("chat:send",{
        receiverId, 
        text
        },(message)=>{
        if(!message.ok){
            console.log(message.error);
            return alert (message.error);
        }
        console.log(message)
        setText("");
        })
    }
    const newChatHandler= function(){
        socket.emit("chat:send",{
        receiverId: addReceiverId.current.value,
        text:addText.current.value
        },(message)=>{
        if(!message.ok){
            return alert (message.error);
        }
        console.log(message)
        // setAddFriend(prev => !prev);
        // console.log(addFriend);
        // addReceiverId.current.value = "";
        // addText.current.value = "";
        })
    }


    return(
        <DMContext.Provider value={
            {
                chatHandler,
                FriendList,
                receiverId,
                setReceiverId,
                friendshipId,
                setFriendshipId,
                MessageList,
                friendName,
                setText,
                text,
                messages,
                setMessage,
                addFriend,
                // setAddFriend,
                newChatHandler,
                addText,
                addReceiverId
            }
        }>
            {children}
        </DMContext.Provider>
    )
}

export default function useDM(){
    return useContext(DMContext);
}
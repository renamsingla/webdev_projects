import React, { useEffect, useState } from 'react'
import useAuth from '../context/authProvider';
import useApp from '../context/DashboardProvider';
import useDM from '../context/DMProvider';

const DirectConvo = () => {

    const {isConnected,socket}= useApp();
    const {token, user}= useAuth();
    const {FriendList,setReceiverId,receiverId, setFriendshipId, friendName,addFriend}= useDM();
    const[friendList, setFriendList]= useState([]);

    // get all friends if the user is connected
    useEffect(()=>{
      if(!socket)return;
        if(!isConnected) return;
        console.log("new frindship2")
        fry();
    },[isConnected,token,socket,addFriend])

    async function fry() {
        const {data} = await FriendList();
        console.log(data);
        setFriendList(data);

    }

  return (
    <div>
      <ul className="friend-list">
            {friendList.map(f=>{
                return (<li key={f.id} 
                className="friend-item"
                onClick={()=>{
                const id= f.userA.id !== user.id ? f.userA.id : f.userB.id
                setReceiverId(id)
                console.log(receiverId);
                setFriendshipId(f.id)
                const name= f.userA.id !== user.id ? f.userA.name : f.userB.name
                friendName.current = name;  }}
                >
                <span>
                    {f.userA.id !== user.id ? f.userA.name : f.userB.name}
                </span>
                </li>)
            })}
            </ul>
    </div>
  )
}

export default DirectConvo

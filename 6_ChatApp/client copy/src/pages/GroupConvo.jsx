import React, { useEffect, useState } from 'react'
import useApp from '../context/DashboardProvider';
import useAuth from '../context/authProvider';
import useGroup from '../context/GroupProvider'

const GroupConvo = () => {
  const {isConnected}= useApp();
  const {token, user}= useAuth();
  const {GroupList, setCurrentGrpId, groupName,addGroup, currentGrpId}= useGroup();
  const[groupList, setGroupList]= useState([]);

  useEffect(()=>{
    if(!isConnected)return;
    fry();
  },[isConnected,token,addGroup])

  async function fry() {
    const data= await GroupList();
    console.log(data);
    setGroupList(data);
  }


  return (
    <div>
      <ul className="friend-list">
        {groupList.map(g=>{
          return (
            <li key={g.id} 
            onClick={()=>{setCurrentGrpId(g.id)
              console.log(currentGrpId)
              const name= g.name;
              groupName.current= name;
            }}
            className="friend-item">
              <span>{g.name}</span>
              </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GroupConvo

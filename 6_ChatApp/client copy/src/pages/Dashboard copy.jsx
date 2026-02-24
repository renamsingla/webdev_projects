import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import auth from '../lib/auth'
import useAuth from '../context/authProvider';
import axios from '../utils/axios';
import { Navigate, Outlet, useNavigate } from 'react-router';

const Dashboard = () => {
  const navigate= useNavigate();
  const[socket, setSocket]=useState(null);
  const {token, user, isLoggedin, logout}= useAuth();
  const[isConnected, setIsConnected]= useState(false);

  // group for create a grp
  // const[grpName, setGrpName]= useState("");
  // add yourself to a group
  // const[groupId, setGroupId]= useState("");
  // send message in a group
  // const[existingGrpId, setExistingGrpId]= useState("")
  // const[grpMessages, setGrpMessages]= useState("")

  // input boxes
  // const[receiverId, setReceiverId]= useState("");
  // const[text, setText]= useState("");
  
  // to get friend list 
  // const[friendList, setFriendList]= useState([]);

  // to show the message on side B
  // const[messages, setMessage]= useState([]);

  // to get group list
  // const[groupList, setGroupList]= useState([]);

  // to show the message on side D
  // const[grpText, setGrpText]= useState([])
  

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

    // socket.on("chat:new",(data)=>{
    //   console.log(data);
    //   setMessage((prevmsgs)=>[...prevmsgs,data])
    // })

    // socket.on("grp:new",(data)=>{
    //   console.log(data);
    //   setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
    // })

    setSocket(socket);
    setIsConnected(true);

    return()=>{
      setIsConnected(false);
      socket.disconnect()
    }
  },[token])

  // get all friends if the user is connected
  // useEffect(()=>{
  //   if(!isConnected) return;
  //   // if(friendList.length==0)return;
  //   axios.get('/api/user/friends').then(({data})=>{
  //     // console.log(data);
  //     setFriendList(data);
  //   }).catch(error=>{
  //     console.log(error)
  //   })
  // },[isConnected,token])

  // useEffect(()=>{
  //   if(!isConnected) return;
  //   axios.get('/api/group/allGroups').then(({data})=>{
  //     // console.log(data);
  //     setGroupList(data);
  //   }).catch(error=>{
  //     console.log(error)
  //   })
  // },[isConnected])

  // const chatHandler= function(){
  //   socket.emit("chat:send",{
  //     receiverId,
  //     text
  //   },(message)=>{
  //     if(!message.ok){
  //       return alert (message.error);
  //     }
  //     console.log(message)
  //     setMessage([...messages,message.message])
  //   })
  // }

  // const groupHandler= function(){
  //   socket.emit("grp:send",{
  //     existingGrpId,
  //     grpMessages
  //   },(msg)=>{
  //     if(!msg.ok){
  //       console.log(msg.error)
  //       return alert (msg.error);
  //     }
  //     console.log("new mesg:" ,msg.message.senderId);
  //     console.log("new mesg:" ,msg.message.text);
  //     setGrpText([...grpText,msg.message])
  //   })
  // }

  // const createGrpHandler= function(){
  //   axios.post('/api/group/create',{
  //     grpName,
  //     userId:user.id
  //   }).then(({data})=>{
  //     setGroupList(prev=>[...prev,data])
  //     console.log(data)
  //   }).catch(error=>{
  //     console.log(error)
  //   })
  // }

  // const addGrpHandler= function(){
  //   axios.post('/api/group/add',{
  //     groupId,
  //     userId: user.id
  //   }).then(({data})=>{
  //     setGroupList(prev=>[...prev,data])
  //     console.log(data);
  //   }).catch(error=>{
  //     console.log(error)
  //   })
  // }

  return (
    <div> 
      welcome to dashboard : {user.name}
      <br />
      Status:{isConnected? <span>connected</span> : <span>not connected.....</span>}
      <br />
      <button onClick={() => logout()}>logout</button>
      <br /> <br />
      <div>
        <button onClick={()=>navigate('/dashboard/game')}>play game</button>
        <button onClick={()=>navigate('/dashboard/directChat')}>directChat</button>
        <button onClick={()=>navigate('/dashboard/groupChat')}>GroupChat</button>
      </div>
      <br />
      {/* <div className="sendMessage">
        <div>send message to a friend</div>
        <input onChange={(e)=>setReceiverId(e.target.value)} type="text" placeholder='friend id' value={receiverId} />
        <input onChange={(e)=>setText(e.target.value)} type="text" placeholder='enter text' value={text} />
        <button onClick={chatHandler} disabled={!isConnected}>send message</button>
      </div> */}
      {/* <br />

      <div className="createGrp">
        <div>create a group</div>
        <input onChange={(e)=>setGrpName(e.target.value)} type="text" placeholder='name of grp' value={grpName} />
        <button onClick={createGrpHandler}>createGrp</button>
      </div>
      <br />

      <div className="addGrp">
        <div>get yourself added to an existing group</div>
        <input onChange={(e)=>setGroupId(e.target.value)} value={groupId} type="text" placeholder='grpId' />
        <button onClick={addGrpHandler}>addGrp</button>
      </div>
      <br />

      <div className="sendGrpMessage">
        <div>send a message on a group</div>
        <input onChange={(e)=>setExistingGrpId(e.target.value)} value={existingGrpId} type="text" placeholder='enetr grp id' />
        <input onChange={(e)=>setGrpMessages(e.target.value)} value={grpMessages} type="text" placeholder='enter text' />
        <button onClick={groupHandler}>send message</button>
      </div>
      <br /> */}

      <div className='chatbox'>

        {/* <div className="sideA">
          <div>friend list</div>
            {friendList.map(f=>{
              return <div key={f.id} 
              onClick={()=>{
                console.log("Clicked on:", f.id);
                axios.get('/api/user/messages',{
                params:{
                  conversationId:f.id
                }
                }).then(({data})=>{
                    console.log(data);
                    setMessage(data);
                  }).catch(error=>{
                    console.log(error)
                  })
              }}>
                <span>
                  {f.userA.id !== user.id ? f.userA.name : f.userB.name}
                </span>
                {f.userA.id!==user.id? <div>{f.userA.name}</div>: ""}
                {f.userB.id!==user.id? <div>{f.userB.name}</div>: ""}
              </div>
            })}
        </div> */}



        {/* <div className="sideB">chat data
          <br />
          {messages.map(m=>{
            return <div key={m.id}>{m.sender.name}-{m.text}</div>
          })}
        </div> */}

        {/* <div className="sideC">group List
          <br />
          <button>addFriendToGrp</button>
          {groupList.map(g=>{
            return <div key={g.id}>{g.name}</div>
          })}
        </div>

        <div className="sideD">group Chat
          <br />
          {grpText.map(m=>{
            return <div key={m.id}>{m.sender.name}-{m.text}</div>
          })}
        </div> */}

      </div>
      <Outlet context={{ socket, isConnected }}/>
    </div>
  )
}

export default Dashboard

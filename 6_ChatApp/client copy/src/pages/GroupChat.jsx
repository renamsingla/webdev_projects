import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../context/authProvider';
import axios from '../utils/axios';
import { useNavigate} from 'react-router';
import useApp from '../context/DashboardProvider';
import './GroupChat.css'

const GroupChat = () => {
   const {isConnected, socket}= useApp();

    const {token, user}= useAuth();
    const navigate= useNavigate();

    // group for create a grp
    const[grpName, setGrpName]= useState("");
    // add yourself to a group
    const[groupId, setGroupId]= useState("");
    // send message in a group
    const[existingGrpId, setExistingGrpId]= useState("")
    const[grpMessages, setGrpMessages]= useState("")

    // to get group list
    const[groupList, setGroupList]= useState([]);

    // to show the message on side D
    const[grpText, setGrpText]= useState([])

    const buttonRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });

    const handleButtonClick = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setFormPosition({
      top: rect.bottom + window.scrollY + 5, // 5px below button
      left: rect.left + window.scrollX
    });
    setShowForm(!showForm);
  
  };

  const buttonRef2 = useRef(null);
  const [showForm2, setShowForm2] = useState(false);
  const [formPosition2, setFormPosition2] = useState({ top2: 0, left2: 0 });
  const handleButtonClick2 = () => {
    const rect2 = buttonRef2.current.getBoundingClientRect();
    setFormPosition2({
      top2: rect2.bottom + window.scrollY + 5, // 5px below button
      left2: rect2.left + window.scrollX
    });
    setShowForm2(!showForm2);
  };

    useEffect(()=>{

        if (!socket) return;

        const handler= (data)=>{
            console.log(data);
            setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
        }

        socket.on("grp:new",handler)

        return () => {
            socket.off("grp:new", handler);  // remove this EXACT handler
        };

    },[socket])

    useEffect(()=>{
        if(!isConnected) return;
        axios.get('/api/group/allGroups').then(({data})=>{
          // console.log(data);
          setGroupList(data);
        }).catch(error=>{
          console.log(error)
        })
      },[isConnected])

    const groupHandler= function(){
        socket.emit("grp:send",{
          existingGrpId,
          grpMessages
        },(msg)=>{
          if(!msg.ok){
            console.log(msg.error)
            return alert (msg.error);
          }
          console.log("new mesg:" ,msg.message.senderId);
          console.log("new mesg:" ,msg.message.text);
          setGrpText([...grpText,msg.message])
        })
      }
    
      const createGrpHandler= function(){
        axios.post('/api/group/create',{
          grpName,
          userId:user.id
        }).then(({data})=>{
          setGroupList(prev=>[...prev,data])
          console.log(data)
        }).catch(error=>{
          console.log(error)
        })
      }
    
      const addGrpHandler= function(){
        axios.post('/api/group/add',{
          groupId,
          userId: user.id
        }).then(({data})=>{
          setGroupList(prev=>[...prev,data])
          console.log(data);
        }).catch(error=>{
          console.log(error)
        })
      }
    
    
  return (
    <div className='groupChat-container'>

      <div className="i3">

        <button onClick={() => logout()} id='logout2'>logout</button>

        <div className="welcome">Welcome  {user.name} to the chatApp- GroupChat</div>

        <button id='dashboard' onClick={()=>navigate('/dashboard')}>dashboard</button>

        <div >
          <button id='createGroup' ref={buttonRef} onClick={handleButtonClick}>create group</button>
          {showForm && (
                    <div className="floating-form-near-button"
                          style={{ top: formPosition.top, left: formPosition.left }}>
                        <div className="floating-form">
                            <input onChange={(e)=>setGrpName(e.target.value)} type="text" placeholder='name of grp' value={grpName} />
                            <button onClick={createGrpHandler}>createGrp</button>
                        </div>
                    </div>
          )}
        </div>

        <div >
          <button id='addGroup' ref={buttonRef2} onClick={handleButtonClick2}>add group</button>
          {showForm2 && (
                    <div className="floating-form-near-button"
                          style={{ top2: formPosition2.top, left2: formPosition2.left }}>
                        <div className="floating-form">
                            <input onChange={(e)=>setGroupId(e.target.value)} value={groupId} type="text" placeholder='grpId' />
                            <button onClick={addGrpHandler}>addGrp</button>
                        </div>
                    </div>
          )}
        </div>
      </div>

      {/* <div className="sendGrpMessage">
        <div>send a message on a group</div>
        <input onChange={(e)=>setExistingGrpId(e.target.value)} value={existingGrpId} type="text" placeholder='enetr grp id' />
        <input onChange={(e)=>setGrpMessages(e.target.value)} value={grpMessages} type="text" placeholder='enter text' />
        <button onClick={groupHandler}>send message</button>
      </div>
      <br /> */}
      <div className="i4">
      <div className="chatbox">

        <div className="sideC">
          <div className="group-header">group List</div>
          <ul className="group-list">
          {groupList.map(g=>{
            return <div key={g.id}
            className="group-item"
            onClick={()=>{
              console.log("Clicked on:", g.id);
              axios.get('/api/group/messages',{
                params:{
                  groupId: g.id
                }
              }).then(({data})=>{
                console.log(data)
                setGrpText(data)
              }).catch(error=>{
                console.log(error)
              })
            }}>
              {g.name}</div>
          })}
          </ul>
        </div>

        <div className="sideD">
          <div className="group-header" >group Chat</div>
          <div>
          {grpText.map(m=>{
            return <div key={m.id}>{m.sender.name}-{m.text}</div>
          })}
          </div>
          <div className="sendmessage">
            <input
              
            />
            <button >
              Send
            </button>
          </div>
        </div>

      </div>
      </div>
      
    </div>
  )
}

export default GroupChat
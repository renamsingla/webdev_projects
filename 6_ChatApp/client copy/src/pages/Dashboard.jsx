import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../context/authProvider';
import axios from '../utils/axios';
import {useNavigate } from 'react-router';
import useApp from '../context/DashboardProvider';
import './Dashboard.css';


const Dashboard = () => {
  const {isConnected, socket}= useApp();
  const navigate= useNavigate();

  const {token, user, logout}= useAuth();
  const[Status, setStatus]= useState("");
  const [newStatus, setNewStatus]= useState("");
  const newStory= useRef();
  const[story, setStory]= useState([]);
  const [openStory, setOpenStory] = useState(null);

  // const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  // const [showMenu, setShowMenu] = useState(false);

  

  useEffect(()=>{
    axios.get('/api/status/getStatus')
    .then(({data})=>{
      let status= data.status.status
      console.log(data.status.status);
      setStatus(status);
    }).catch(error=>{
      console.log(error);
    })
  },[token, Status])

  const changeStatusHandler= function(){
    axios.post('/api/status/changeStatus',{
      newStatus,
      userId: user.id
    }).then(({data})=>{
      let status= data.status.status
      console.log(data.status.status);
      setStatus(status);
      setNewStatus("")
    }).catch(error=>{
      console.log(error)
    })
  }
  

  useEffect(()=>{
     axios.get('/api/story/allStory')
    .then(({data})=>{
      console.log(data);
      data.storyArray.map(m=>{
        setStory(prev=>[...prev,m])
      })
    })
    .catch(error=>{
      console.log(error);
    })
  },[token]);

  const storyHandler= async function(e){
    e.preventDefault();

    const file= newStory.current.files[0]
    newStory.current.value="";

    const formData= new FormData();
    formData.append("file", file);
    formData.append("userId", user.id)
  
    let data= await axios.post('/api/story/addStory',formData,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(({data})=>{
      let stories=data.story
      let base64= data.base64
      // console.log(data);
      // console.log(data.base64);
      // console.log(base64);
      // console.log(stories);
      
      setStory(prev=>[...prev,{"file":base64,"create":stories.createdAt , "expire":stories.expiresAt}])
    }).catch(error=>{
      console.log(error)
    })
  }

  return (
    <div className='dashboard-container'> 
    <div className="item1">
      <button onClick={() => logout()} id='logout'>logout</button>
      <div id='changestatus'>
          <input onChange={(e)=>setNewStatus(e.target.value)} type="text" value={newStatus} placeholder='new status-' />
          <button onClick={changeStatusHandler}>change status</button>
      </div>
      <div className="userstory">
        <form onSubmit={storyHandler}>
          <input ref={newStory} type="file" />
          <button>add story</button>
        </form>
      </div>
    </div>
    <div className="item2">

      <div className='userdashboard'>
        Welcome to the chatApp : {user.name}
      </div>

      <div className='items'>
        <button onClick={()=>navigate('/directChat')}>directChat</button>
        <button onClick={()=>navigate('/groupChat')}>GroupChat</button>
        <button onClick={()=>navigate('/chat')}>Chat</button>
      </div>

      <div className='userstatus'>
        STATUS:
        <div>{Status}</div>

      </div>

      <div className="story-previews">
        STORY:
        {story.map((s,index)=>{
          return<img key={index} src={s.file} alt="story" className="story-circle"
           onClick={() => setOpenStory(s)} 
           />
        })}
        
      </div>
      {openStory && (
        <div className="story-modal" onClick={() => setOpenStory(null)}>
          <img
            src={openStory.file}
            alt="full-story"
            className="story-full"
          />
        </div>
      )}
    </div>
    </div>
  )
}
      
export default Dashboard
import React, { useEffect, useRef, useState } from 'react'
import useApp from '../context/DashboardProvider';
import useAuth from '../context/authProvider';
import { useNavigate } from 'react-router';
import axios from "../utils/axios"

const Profile = () => {
  const[statustype, setStatustype]= useState(true);
  const {isConnected, socket}= useApp();
  const navigate= useNavigate();

  const {token, user, logout}= useAuth();
  const[Status, setStatus]= useState("");
  const [newStatus, setNewStatus]= useState("");
  // const newStory= useRef();
  const[story, setStory]= useState([]);
  const [openStory, setOpenStory] = useState(null);

  const fileRef = useRef(null);
  const[storyCount, setStoryCount]= useState(0);
  const [deleteS, setDeleteS] = useState(null);
  const[sure, setSure]= useState(false);
  const[getAgain, setGetAgain]= useState(false);

  async function deleteStory() {
    if(sure==true){
      const data= await axios.delete('api/story/delete',{
        data:{id:deleteS}
      }).then(data=>{
        console.log(data)
        setGetAgain(prev=>!prev)
      }).catch(error=>{
        console.log(error)
      })
    }else{
      console.log("not working")
    }
  }

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
      setStoryCount(data.storyArray.length)
      console.log(data.storyArray.length)
      setStory(data.storyArray);
      console.log("set story")
    })
    .catch(error=>{
      console.log(error);
    })
  },[getAgain]);

  async function storyHandler(file){
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
      setStoryCount(prev=>prev+1);
      setStory(prev=>[...prev,{"file":base64,"create":stories.createdAt , "expire":stories.expiresAt}])
      // console.log(storyCount)
    }).catch(error=>{
      console.log(error)
    })
  }
  const handleButtonClick = () => {
    fileRef.current.click(); // opens file picker
  };
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log("Selected file:", file);
  // call your upload API here
  storyHandler(file);
};


  return (
    <div className='profile-page'>

      <div className="id-content">
        <div className="heading">ID: {user.id}</div>
      </div>

      <div className="status-content">

        <div className="heading">STATUS:</div>

        <div className='status'>
          {statustype?(<div className="view-status">{Status
          //  || <div>hey there! I am using ChatOn</div>
            }</div>)
        :(<input className="view-status-input" 
            onChange={(e)=>setNewStatus(e.target.value)} 
            type="text" value={newStatus} placeholder="new status"/>)}
        {!statustype && <button className='change' onClick={()=>{changeStatusHandler(); setStatustype(prev=>!prev)}}>change</button>}
        </div>

        <button className='edit' onClick={()=>{setStatustype(prev=>!prev); setNewStatus("")}}>edit</button>

      </div>


      <div className="story-content">
   
        <div className="heading">STORY: <div style={{paddingLeft:'0px', fontSize:'10px'}}>**Double tap to Delete </div></div>

        {/* <div className="stories"> */}
          <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="story-previews">

        {story.map((s,index)=>{
          return(
          <div className="story-wrapper" key={s._id}>
          <img key={s._id} src={s.file} alt="story" className="story-circle"
           onClick={() => setOpenStory(s)} 
          />
          <button  onClick={()=>{setDeleteS(prev => prev === s._id ? null :s._id); setSure(prev=>!prev); deleteStory()}} 
            className='delete-story'>-</button>
          </div>
        )
        })}
        <button disabled={storyCount==4} className='add-story' onClick={handleButtonClick}>+</button>
        
        </div>
      {/* </div> */}
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

export default Profile

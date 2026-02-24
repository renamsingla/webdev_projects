import React, {useState } from 'react'
import useAuth from '../context/authProvider';
import {useNavigate } from 'react-router';
import useApp from '../context/DashboardProvider';
import DirectConvo from './DirectConvo';
import GroupConvo from './GroupConvo';
import { DMProvider } from '../context/DMProvider';
import DirectMessages from './DirectMessages';
import GroupMessages from './GroupMessages';
import Addons from './Addons';
import { GroupProvider } from '../context/GroupProvider';
import Profile from './Profile';

const Chat = () => {
    const[chatType, setChatType]=useState('directconvo')
    const {logout}= useAuth();
    const [showAddons, setShowAddons] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const[btn, setbtn]= useState("");

  return (
    <>
    <div className='chat-container'>

        <div className="sidebar">
            <div className="addChat">
                <button disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("new friend")}}>new friend</button>
                <button disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("new group")}}>new group</button>
                <button disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("create group")}}>create group</button>
            </div>

            <div className="user">
                <button>status</button>
                <button onClick={()=>{setShowProfile(prev => !prev);  setShowAddons(false)}}>profile</button>
                <button onClick={() => logout()}>logout</button>
            </div>
        </div>

        <div className="chat-box">

            <div className="list-area">
                
                <div className='chat-name'>Welcome to the ChatApp</div>

                <div className={`select-chat-type`}>
                    <button 
                    style={{
                        backgroundColor: chatType === 'directconvo' ?'#daf8cb'  : '',
                        color: chatType === 'directconvo' ? '#128c7e' : '',
                        border: chatType === 'directconvo' ? '2px solid #128c7e' : ''
                    }}
                    onClick={()=>setChatType('directconvo')}>direct chat</button>
                    <button
                    style={{
                        backgroundColor: chatType === 'groupconvo' ?'#daf8cb'  : '',
                        color: chatType === 'groupconvo' ? '#128c7e' : '',
                        border: chatType === 'groupconvo' ? '2px solid #128c7e' : ''
                    }}
                    onClick={()=>setChatType('groupconvo')}>group chat</button>
                </div>

            </div>
            
            <>
            <DMProvider><GroupProvider>
                {chatType=='directconvo'?(
                    <>
                    <div className="list">
                        <DirectConvo />
                    </div>
                    <div className="chat-area">
                    <DirectMessages />
                    </div>
                    </>
                ):(
                    <>
                    <div className="list">
                        <GroupConvo />
                    </div>
                    <div className="chat-area">
                    <GroupMessages />
                    </div>
                    </>
                )}
                {showAddons && (
                    <div className='addon'>
                    <Addons btn={btn} setShowAddons={setShowAddons} />
                    </div>
                )}
                {showProfile && (
                    <div className="profile">
                        <div className="profile-content">
                            <Profile/>
                        </div>
                    </div>
                )}
            </GroupProvider></DMProvider>
            </>
        </div>

    </div>
      
    </>
  )
}

export default Chat

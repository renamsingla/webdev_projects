import React, { useEffect, useState, useRef } from 'react'
import useAuth from '../context/authProvider';
import axios from '../utils/axios';
import { useNavigate} from 'react-router';
import useApp from '../context/DashboardProvider';
import './DirectChat.css'

const DirectChat = () => {
    const {isConnected, socket}= useApp();
    
    const {token, user, logout}= useAuth();
    const navigate= useNavigate();

    // input boxes
    const[receiverId, setReceiverId]= useState("");
    const[text, setText]= useState("");
    
    // to get friend list 
    const[friendList, setFriendList]= useState([]);

    // to show the message on side B
    const[messages, setMessage]= useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formPosition, setFormPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const[addFriend, setAddFriend]= useState(false);
    const addText= useRef();
    const addReceiverId= useRef();

    const friendName= useRef("");


    useEffect(()=>{
        if (!socket) return;
        
        socket.on("chat:new",(data)=>{
            console.log(data);
            console.log(user.id)
            console.log(data.receiverId)
            console.log(receiverId)

            if(user.id==data.message.senderId){
                setMessage((prevmsgs)=>[...prevmsgs,data.message])
                
            }else{
                if(user.id==data.receiverId && receiverId==data.message.senderId){
                    setMessage((prevmsgs)=>[...prevmsgs,data.message])
                }else{
                    setAddFriend(prev => !prev);
                }
            }
        })

        return()=>{
            socket.off("chat:new")
        }
    },[socket])

    // get all friends if the user is connected
    useEffect(()=>{
        if(!isConnected) return;
        // if(friendList.length==0)return;
        axios.get('/api/user/friends').then(({data})=>{
        // console.log(data);
        setFriendList(data);
        }).catch(error=>{
        console.log(error)
        })
    },[isConnected,token, addFriend])

    const handleButtonClick = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setFormPosition({
      top: rect.bottom + window.scrollY + 5, // 5px below button
      left: rect.left + window.scrollX
    });
    setShowForm(!showForm);
  };

    const chatHandler= function(){
        socket.emit("chat:send",{
        receiverId,
        text
        },(message)=>{
        if(!message.ok){
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
        setAddFriend(prev => !prev);
        // console.log(addFriend);
        addReceiverId.current.value = "";
        addText.current.value = "";
        })
    }

  return (
    <div className='directChat-container'>
        <div className="i1">
                <button onClick={() => logout()} id='logout2'>logout</button>
                <div className="welcome">Welcome  {user.name} to the chatApp- DirectChat</div>
                <button id='dashboard' onClick={()=>navigate('/dashboard')}>dashboard</button>
                <div >
                <button id='addFriend' ref={buttonRef} onClick={handleButtonClick}>add friend</button>
                {showForm && (
                    <div className="floating-form-near-button"
                          style={{ top: formPosition.top, left: formPosition.left }}>
                        <div className="floating-form">
                            <input ref={addReceiverId} type="text" placeholder='friend id' />
                            <input ref={addText} type="text" placeholder='enter text'  />
                            <button onClick={newChatHandler} disabled={!isConnected}>send message</button>
                        </div>
                    </div>
                )}
            </div>
            </div>

        <div className="i2">
            

      <div className="chatbox">

        <div className="sidea">
            <div className="friends-header">friend list</div>
            <ul className="friend-list">
            {friendList.map(f=>{
                return (<li key={f.id} 
                className="friend-item"
                onClick={()=>{
                setReceiverId(f.userA.id !== user.id ? f.userA.id : f.userB.id) 
                const name= f.userA.id !== user.id ? f.userA.name : f.userB.name
                friendName.current = name; 
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
                </li>)
            })}
            </ul>
        </div>
        <div className="sideb">
            <div className="friends-header" >{friendName.current}</div>
          <div className="messages">
            {messages.map((m) => {
              const isMine = m.sender.id === user.id;
              return ( 
                <div
                  key={m.id}
                  className={`message ${isMine ? "mine" : "theirs"}`}
                >
                  {/* {!isMine && <div className="sender">{m.sender.name}</div>} */}
                  <div className="bubble">{m.text}</div>
                </div>
              );
            })}
          </div>
          <div className="sendmessage">
            <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Type a message"
              value={text}
            />
            <button onClick={chatHandler} disabled={!isConnected}>
              Send
            </button>
          </div>
          </div>
        
      </div>
      </div>
    </div>
  )
}

export default DirectChat
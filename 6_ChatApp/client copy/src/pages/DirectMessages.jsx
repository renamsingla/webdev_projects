import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../context/authProvider';
import useApp from '../context/DashboardProvider';
import useDM from '../context/DMProvider';


const DirectMessages = () => {
    const {setFriendshipId, friendshipId,MessageList, friendName, chatHandler,text, setText, setMessage, messages, receiverId}= useDM();
    const {isConnected}= useApp();
    const {token, user}= useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    useEffect(()=>{
            if(!isConnected) return;
            if(!friendshipId){
                setMessage([])
                return;
            }
            fry();
    },[isConnected,token, friendshipId])
    
    async function fry() {
        const {data} = await MessageList();
        console.log(data);
        setMessage(data);
    }

  return (
    <div className='message-list'>
    <div className="friend-header" 
    style={{
            backgroundColor: !friendshipId ?'rgb(224, 222, 222)'  : '',
            border: !friendshipId ? 'none' : ''
        }}
    >
        {friendshipId && <div>{friendName.current}</div>}
        {friendshipId && <button onClick={()=>{setFriendshipId("")}}>x</button>}
        </div>
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
            <div ref={messagesEndRef}></div>
    </div>
    <div className="sendMessage">
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
  )
}

export default DirectMessages

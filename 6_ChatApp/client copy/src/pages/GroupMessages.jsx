import React, { useEffect, useRef } from 'react'
import useGroup from '../context/GroupProvider'
import useApp from '../context/DashboardProvider';
import useAuth from '../context/authProvider';

const GroupMessages = () => {
  const{currentGrpId,setCurrentGrpId, groupName, setGrpText,grpText, GroupMessageList, setText, text, groupHandler}= useGroup();
  const {isConnected}= useApp();
  const {token, user}= useAuth();
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [grpText]);

  useEffect(()=>{
    console.log(currentGrpId);
    if(!isConnected) return;
    if(!currentGrpId){
      setGrpText([]);
      return;
    }
    fry();
  },[isConnected, token, currentGrpId])

  async function fry() {
    const data= await GroupMessageList();
    console.log(data);
    setGrpText(data);
  }
  return (
    <div className='groupMessage-list'>
      <div className="group-header"
      style={{
            backgroundColor: !currentGrpId ?'rgb(224, 222, 222)'  : '',
            border: !currentGrpId ? 'none' : ''
      }}>
        {currentGrpId && <div>{groupName.current}</div>}
        {currentGrpId && <button onClick={()=>{setCurrentGrpId("")}}>x</button>}
      </div>
      <div className="messages">
        {grpText.map(m=>{
          const isMine = m.sender.id === user.id;
            return (
            <div key={m.id}
              className={`message ${isMine ? "mine" : "theirs"}`}
            >
              {!isMine && <div className="sender">{m.sender.name}</div>}
              {isMine && <div className="sender">you</div>}
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
        <button onClick={groupHandler} disabled={!isConnected}>
            Send
        </button>
    </div>
    </div>
  )
}

export default GroupMessages

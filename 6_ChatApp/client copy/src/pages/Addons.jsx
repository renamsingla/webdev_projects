import React from 'react'
import useDM from '../context/DMProvider';
import useGroup from '../context/GroupProvider';

const Addons = ({btn,setShowAddons}) => {
    const{newChatHandler,addText,addReceiverId}= useDM();
    const{createGroup, createGrpHandler, existingGrpId, addGrpHandler}=useGroup();

    console.log(btn);

    function content(){
        if(btn=='new friend'){
            return(
                <>
                <input ref={addReceiverId} type="text" placeholder='friend id'/>
                <input ref={addText} type="text" placeholder='enter text'  />
                <button onClick={()=>{newChatHandler(); setShowAddons(prev => !prev)}}>add friend</button>
                </>
            )
        }else if(btn=="new group"){
            return(
                <>
                <input ref={existingGrpId} type="text" placeholder='group id'/>
                <button onClick={()=>{addGrpHandler(); setShowAddons(prev => !prev)}}>add group</button>
                </>
            )
        }else{
            return(
                <>
                <input ref={createGroup} type="text" placeholder='group name'/>
                <button onClick={()=>{createGrpHandler(); setShowAddons(prev => !prev)}}>create group</button>
                </>
            )
        }
    }
  return (
    <div className='addon-content'>
        <div>{btn}</div>
        {content()}
    </div>
  )
}

export default Addons

import React from 'react'
import useDM from '../context/DMProvider';
import useGroup from '../context/GroupProvider';

const Addons = ({btn,setShowAddons}) => {
    const{newChatHandler,addText,addReceiverId}= useDM();
    const{createGroup, createGrpHandler, existingGrpId, addGrpHandler}=useGroup();

    console.log(btn);

    function content(){
        if(btn=='ADD A FRIEND'){
            return(
                <>
                <input ref={addReceiverId} type="text" placeholder='friend id'/>
                <input ref={addText} type="text" placeholder='enter text'  />
                <button onClick={()=>{newChatHandler(); setShowAddons(prev => !prev)}}>add</button>
                </>
            )
        }else if(btn=="ADD EXISTING GROUP"){
            return(
                <>
                <input ref={existingGrpId} type="text" placeholder='group id'/>
                <button onClick={()=>{addGrpHandler(); setShowAddons(prev => !prev)}}>add</button>
                </>
            )
        }else{
            return(
                <>
                <input ref={createGroup} type="text" placeholder='group name'/>
                <button onClick={()=>{createGrpHandler(); setShowAddons(prev => !prev)}}>create</button>
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

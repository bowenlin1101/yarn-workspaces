import React from 'react';
import ReactDOM from 'react-dom/client';
import video from "./images/video.png"
import call from "./images/call.png"
import search from "./images/search.png"
import dropdown from "./images/dropdown.png"
import messageprofile from "./images/message-profile.png"


function Icons(){
  return(
    <div className='icon-wrapper'>
      <img style={{margin:"0.5em 1em"}} src={video}></img>
      <img style={{margin:"0.5em 1em"}} src={call}></img>
      <img style={{margin:"0.3em 0.7em"}} src={search}></img>
      <img style={{margin:"0.3em 0.8em"}} src={dropdown}></img>
    </div> 
  )
}

function MessageIcon(){
  return(
    <>
      <img className='message-icon' src={messageprofile}></img>
      <a >Boken Lin</a>
    </>
  )
}


function MessageProfile(){
    return(
      <div className='message-profile' >
          <MessageIcon/>
          <Icons></Icons>
      </div>
    )
  }

export default MessageProfile
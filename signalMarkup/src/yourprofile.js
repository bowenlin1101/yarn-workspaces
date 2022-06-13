import React from 'react';
import ReactDOM from 'react-dom/client';
import yourprofilepicture from "./images/your-profile.jpeg"
import newconversation from "./images/newconversation.png"

function YourProfile(){
    return (
      <div className='your-profile'>
        <ProfileIcon/>
      </div>
    )
}

function ProfileIcon(){
  return(
    <>
    <img className='your-profile' src={yourprofilepicture}></img>
    <img className='new-conversation' src={newconversation}></img>
    </>
  )
}

export default YourProfile
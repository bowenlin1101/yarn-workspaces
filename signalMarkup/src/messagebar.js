import React from 'react';
import ReactDOM from 'react-dom/client';
import plus from './images/plus.png'
import microphone from './images/microphone.png'
import sticker from './images/sticker.png'
import emote from './images/emote.png'


function RightEmotes(){
  return (
    <div style={{marginRight: "50px"}}>
      <img src={sticker}/>
      <img src={microphone}/>
      <img src={plus}/>
    </div>
  )
}

function MessageBar(){
    return(
      <div className='message-bar' >
        <img src={emote}/>
        <input placeholder='Send a message' type="text" className='message-search'/>
        <RightEmotes/>
      </div>
    )
  }
export default MessageBar
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import YourProfile from "./yourprofile"
import ContactWrapper from "./contactwrapper"
import MessageProfile from "./messageprofile"
import MessageBar from "./messagebar"
import ChatWrapper from "./chatwrapper"

function Grid(){
  return(
    <div className='grid'>
      <YourProfile/>
      <MessageProfile/>
      <ContactWrapper/>
      <MessageBar/>
      <ChatWrapper/>
    </div>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Grid />
  </React.StrictMode>
);


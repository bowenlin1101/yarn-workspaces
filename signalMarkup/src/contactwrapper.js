import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import yourprofile from "./images/your-profile.jpeg"
import messageprofile from "./images/message-profile.png"
import wendiicon from "./images/wendi-icon.jpeg"
import christinaicon from "./images/christina-icon.png"
import notetoselficon from "./images/signal-icon.png"
import seen from "./images/seen.png"
import magnifyingglass from "./images/magnifying-glass.png"

const icons = {
  'yourprofile': yourprofile, 
  'messageprofile': messageprofile,
  'wendiicon': wendiicon,
  'christinaicon': christinaicon,
  "notetoselficon": notetoselficon
}


function SearchBar(){
  return(
    <>
    <input className='contact-search' type="text" placeholder='Search'>
    </input>
    <img className='magnifyingglass' src={magnifyingglass}></img>
    </>
    
  )
}

function Contact(props){
  return(
      <div id={props.name} onClick= {(e)=> props.onClick(e)} className={'message ' + props.className} key={props.id}>
        <img className='message-icon' src={icons[props.icon]}></img>
        <p className='message-name'>{props.name}</p>
        <p className='message-lastmessage'>{props.lastMessage.length < 60 ? props.lastMessage : props.lastMessage.slice(0,60) + "..."}</p>
        <p className='message-date'>{props.date}</p>
        <img src={seen} className="message-seen"/>
      </div>
  )
}

function ContactList(props){
  return(
    <div style={{height:"100%"}}>
      {props.contacts.map((n,i) => (props.selected == n.name ? <Contact key={i} onClick={(e) => props.onClick(e)} className="selected" id={i} name={n.name} date={n.date} icon={n.icon} lastMessage={n.lastMessage} /> : <Contact key={i} onClick={(e) => props.onClick(e)} className="" id={i} name={n.name} date={n.date} icon={n.icon} lastMessage={n.lastMessage} />))}
    </div>
  )
}

function ContactWrapper(){
  const [contacts, setContacts] = useState([{name:"Boken Lin", date:"18:53", icon:'messageprofile', lastMessage:""}, {name:"Note to Self", date:"18:53", icon:'notetoselficon', lastMessage:"password"},{name:"Wendi Lin", date:"18:53", icon:'wendiicon', lastMessage:"I'm shaking in utter shock and disgust right now. Like Turning Red was actually one of the worst movies I've ever seen in my life"},  {name:"Christina Li", date:"18:53", icon:'christinaicon', lastMessage:"bruh"}])
  const [selected, setSelected] = useState("")

  function handleSelected(e){
    console.log(e.target.id)
    setSelected(e.target.id)
  }

  return(
    <div className='contact-wrapper'>
      <center><SearchBar/></center>
      <ContactList contacts={contacts} selected={selected} onClick={(e) => handleSelected(e)} />
    </div>
  )
}

export default ContactWrapper
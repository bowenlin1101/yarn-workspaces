import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

function MessageBubble(props){
  return(
    <div className={props.className}>
      {props.message} 
      </div>
  )
}

function MessageBubbleContainer(props){

  var messagecontainers = []
  var userblocks = []
  props.messages.map((n,i) => {
    userblocks.push(n);
    if (props.messages[i + 1]){
      if (props.messages[i].user != props.messages[i+1].user){
        messagecontainers.push(userblocks)
        userblocks = []
      }
    } else {
      messagecontainers.push(userblocks)
      userblocks = []
    }
  })


  return(
    messagecontainers.map((messageblock,i) => {
      if (messageblock.length == 1){
        return (
          <div className='message-block'>
             <MessageBubble key={i} className={messageblock[0].user == 'you' ? "your-single" + " your-message-bubble": 'their-single' + " their-message-bubble"} message={messageblock[0].message} date={messageblock[0].date}/>
          </div>
          )
      } else {
        return (
          <div className='message-block'>
            {messageblock.map((message, j) => {
              if (j == 0){
                return <MessageBubble key={i+j+1} className={message.user == 'you' ? 'your-top' + " your-message-bubble": 'their-top' + " their-message-bubble"} message={message.message} date={message.date}/>
              } else if (j == messageblock.length - 1){
                return <MessageBubble key={i+j+1} className={message.user == 'you' ? 'your-bottom' + " your-message-bubble": 'their-bottom' + " their-message-bubble"}  message={message.message} date={message.date}/>
              } else {
                return <MessageBubble key={i+j+1} className={message.user == 'you' ? 'your-mid' + " your-message-bubble": 'their-mid' + " their-message-bubble"}  message={message.message} date={message.date}/>
              }
            })}
          </div>
        )
      }
    })
  )
}

function ChatWrapper(){

  const [messages, setMessages] = 
  useState([
    {message: "Hi there what's up?", user: "you", date:"16:24"},
    {message: "Nothing much, how are you?", user: "them", date:"16:25"},
    {message: "Doing pretty good lol", user: "you", date:"16:24"},
    {message: "I recently had a job opportunity which is really sick my guy. I should take you there to see.", user: "you", date:"16:25"},
    {message: "There were hot chicks left and right. I couldn't believe my eyes dude", user: "you", date:"16:25"},
    {message: "Man! You really ought to show me some time", user: "them", date:"16:26"},
    {message: "I also recently got a job", user: "them", date:"16:26"},
    {message: "I tried applying for Macdonald's but they didn't accept me for some reason", user: "them", date:"16:27"},
    {message: "But then I landed one at Tim Hortons which is arguably better lol.", user: "them", date:"16:27"},
    {message: "Sheesh. That's great dude. Sure man! Will do. Till then.", user: "you", date:"16:24"},
    {message: "See ya later", user: "you", date:"16:28"},
    {message: "Alright cya", user: "them", date:"16:28"},
  ])

    return(
      <div className='chat-wrapper'>
         <MessageBubbleContainer messages={messages} />
         {/* <MessageBubble/> */}
      </div>
    )
  }

export default ChatWrapper
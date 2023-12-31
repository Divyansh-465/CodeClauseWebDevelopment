import React, {useEffect, useState} from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, username, room}) {

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if(currentMessage !== ""){
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send-message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(()=>{
    socket.on('receive-message', (data)=>{
      setMessageList((list) => [...list, data]);
    });
    return () => {
      socket.removeListener('receive-message');
    }
  }, [socket]);

  return (
    <div className='flex'>
    <div className='chat-window'>
      <div className='chat-header'>
      <p>Live Chat</p>
      </div>

      <div className='chat-body'>
      <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return <div className='message' id={username === messageContent.author ? "other" : "you"}>
              <div>
                <div className='message-content'>
                  <p>{messageContent.message}</p>
                </div>
                <div className='message-meta'>
                  <p>{messageContent.time}</p>
                  <p>{messageContent.author}</p>
                </div>
              </div>
            </div>
          })}
        </ScrollToBottom>
      </div>

      <div className='chat-footer'>
        <input type="text" 
        value={currentMessage}
        placeholder='Write something...' 
        onChange={(event)=>{setCurrentMessage(event.target.value);
        }}
        onKeyPress={(event) => {
          event.key === "Enter" && sendMessage();
        }}
        />
        <button onClick={sendMessage}>&#9654;</button>
      </div>
      </div>
    </div>
  )
}

export default Chat;
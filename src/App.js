import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useEffect, useRef, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './App.css';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

// import fs from "fs";

function App() {

  const API_KEY = "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"

  const [count, setCount] = useState(0)
  const messageListRef = useRef(null);
  const [isChatVisible, setChatVisible] = useState(false);
  const [getMessage, setGetMessage] = useState([])
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);

  }

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        // systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT

      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
        setIsTyping(false);
      });
  }


  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      const fetchedMessages = response.data.data; // Assuming your messages are in response.data.data
      console.log(fetchedMessages);
      setGetMessage(fetchedMessages)
      // setMessages(newMessages);
      // console.log(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages from backend:", error);
    }
  }

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  console.log(getMessage[9]?.content?.[0]?.text?.value);
  return (
    <>

      {isChatVisible ? (
        <div className="chat-container">
          <span style={{ marginLeft: "8px", marginTop: "8px", cursor: "pointer", width: "30px", display: "block" }} onClick={() => setChatVisible(false)}><CloseIcon /></span>
          <MessageList className="message-list" ref={messageListRef}>
            {messages.map((message, i) => {
              return <Message key={i} model={message} />
            })}
            {/* {isTyping && <TypingIndicator content="Bot is typing" />} */}
          </MessageList>
          <MessageInput className="message-input" placeholder="Type message here" onSend={handleSend} />
        </div>
      ) : (
        // <ChatIcon color="secondary" sx={{ fontSize: 35 }} className="open-chat-button" style={{ cursor: "pointer", borderRadius: "20px" }} onClick={() => setChatVisible(true)} />
        <img src='conversation.png' className="open-chat-button" style={{ width: "45px", height: "45px" }} onClick={() => setChatVisible(true)} alt='Chat interface' />

      )}
      {getMessage.map((val, i) => (
        <p key={i}>{val?.content?.[0]?.text?.value}</p>
      ))}
    </>
  );
}

export default App;

// {
//   ge.map((message, index) => (
//     <div key={index}>
//       <p>{message.message}</p>
//       {/* Render other message details as needed */}
//     </div>
//   ))
// }
// await fetch("https://api.openai.com/v1/chat/completions",
//   {
//     method: "POST",
//     headers: {
//       "Authorization": "Bearer " + API_KEY,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(apiRequestBody)
//   }).then((data) => {
//     return data.json();
//   }).then((data) => {
//     setMessages([...chatMessages, {
//       message: data.choices[0].message.content,
//       sender: "ChatGPT"
//     }]);
//     setIsTyping(false);
//   });
//   }
/*import './Chatbot.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(Date.now()); // keep sessionId stable during component lifecycle

  useEffect(() => {
    setMessages([{ sender: 'bot', text: 'Hello! How can I help with your tea leaves today?' }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post('http://localhost:5002/api/chatbot', {
        message: input,
        sessionId: sessionId,
      });

      const { message, reason, prevention, advice } = response.data;

      let botReply = message || reason || prevention || advice || 'Sorry, I didn’t quite catch that.';

      if (response.data.message) {
        botReply = response.data.message; // if general message is available, use it
      } else if (response.data.reason) {
        botReply = response.data.reason; // if reason is available, use it
      } else if (response.data.prevention) {
        botReply = response.data.prevention; // if prevention is available, use it
      } else if (response.data.advice) {
        botReply = response.data.advice; // if advice is available, use it
      }

      const botMessage = { sender: 'bot', text: botReply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'There was an error. Please try again later.' },
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-title">Tea Leaf Assistant</div>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        className="input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about the tea leaf..."
      />
      <button className="send-button" onClick={sendMessage}>Send</button>
    </div>
  );
}


export default ChatBot;  
*/

import './Chatbot.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(Date.now());
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ 
      sender: 'bot', 
      text: 'Hello! How can I help with your tea leaves today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5002/api/chatbot', {
        message: input,
        sessionId: sessionId,
      });

      const { message, reason, prevention, advice } = response.data;
      let botReply = message || reason || prevention || advice || 'Sorry, I didn’t quite catch that.';

      setTimeout(() => {
        const botMessage = { 
          sender: 'bot', 
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      }, 800); // Simulate typing delay

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          sender: 'bot', 
          text: 'There was an error. Please try again later.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">Tea Leaf Assistant</div>
        <div className="chatbot-subtitle">Your personal tea cultivation expert</div>
      </div>
      
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-text">{msg.text}</div>
            <div className="message-time">{msg.timestamp}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the tea leaf..."
        />
        <button 
          className="send-button" 
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chatbot;


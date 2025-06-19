import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi there! How can I help you today?',
      sender: 'bot',
      time: '9:41 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setShowOptions(false);

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse;
      
      if (inputValue.toLowerCase().includes('portfolio')) {
        botResponse = {
          id: messages.length + 2,
          text: 'I can definitely help with that. What specific aspect of your portfolio would you like to discuss? Here are some common topics:',
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setShowOptions(true);
      } else {
        botResponse = {
          id: messages.length + 2,
          text: 'I can provide insights on your investments, market trends, and help with portfolio strategy. What would you like to know more about?',
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickOption = (option) => {
    const userMessage = {
      id: messages.length + 1,
      text: option,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setShowOptions(false);

    // Simulate bot response based on option
    setTimeout(() => {
      let botResponse;
      
      switch(option) {
        case 'Portfolio Analysis':
          botResponse = {
            id: messages.length + 2,
            text: 'Your portfolio currently consists of 12 holdings with a total value of $284,750.25. Your top 3 holdings are AAPL (35%), MSFT (25%), and NVDA (15%). Would you like a detailed breakdown?',
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        case 'Investment Strategy':
          botResponse = {
            id: messages.length + 2,
            text: 'Based on your risk profile, I recommend a 60/40 stocks to bonds allocation. Your current allocation is 75/25, which may be too aggressive. Would you like me to suggest specific rebalancing trades?',
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        case 'Risk Assessment':
          botResponse = {
            id: messages.length + 2,
            text: 'Your portfolio has a beta of 1.2, meaning it\'s 20% more volatile than the market. Your sector concentration in tech (45%) increases your risk exposure. Would you like diversification suggestions?',
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        case 'Market Updates':
          botResponse = {
            id: messages.length + 2,
            text: 'Latest market insights:\n- Tech sector up 2.8% this week\n- Fed expected to hold rates steady\n- Oil prices volatile amid supply concerns\nWould you like details on any specific market?',
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          break;
        default:
          botResponse = {
            id: messages.length + 2,
            text: 'I can help analyze your portfolio, suggest investment strategies, assess risk, and provide market updates. What would you like to focus on?',
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="assistant-container">
      <h1>Investment Assistant</h1>
      
      <div className="chat-container">
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{message.time}</div>
              </div>
            </div>
          ))}
          
          {showOptions && (
            <div className="quick-options">
              <button onClick={() => handleQuickOption('Portfolio Analysis')}>
                Portfolio Analysis<br />
                <span>Review your current investments</span>
              </button>
              <button onClick={() => handleQuickOption('Investment Strategy')}>
                Investment Strategy<br />
                <span>Plan your future investments</span>
              </button>
              <button onClick={() => handleQuickOption('Risk Assessment')}>
                Risk Assessment<br />
                <span>Evaluate your risk exposure</span>
              </button>
              <button onClick={() => handleQuickOption('Market Updates')}>
                Market Updates<br />
                <span>Latest market insights</span>
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Send →</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
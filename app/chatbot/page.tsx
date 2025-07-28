"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  BarChart3, 
  Target,
  Lightbulb,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Hello! I'm your AI trading assistant. I can help you with stock analysis, market insights, trading strategies, and answer questions about your portfolio. What would you like to know?",
    sender: 'bot',
    timestamp: new Date(),
    suggestions: [
      "Analyze AAPL stock",
      "What's the market outlook?",
      "Show me trending stocks",
      "Explain P/E ratios"
    ]
  }
];

const SAMPLE_RESPONSES = {
  "analyze": "Based on current market data, here's my analysis:\n\n📈 **Technical Analysis:**\n- RSI: 65 (Slightly overbought)\n- Moving averages show bullish trend\n- Volume is above average\n\n💡 **Recommendation:** Consider taking profits if you're long, or wait for a pullback to enter.",
  "market": "Current market conditions:\n\n🌍 **Market Overview:**\n- S&P 500: +0.8% today\n- Tech sector leading gains\n- Low volatility environment\n\n⚠️ **Key factors to watch:**\n- Federal Reserve policy decisions\n- Earnings season results\n- Geopolitical developments",
  "trending": "Here are today's trending stocks:\n\n🔥 **Top Movers:**\n1. NVDA: +5.2% (AI chip demand)\n2. TSLA: +3.8% (Production update)\n3. AAPL: +2.1% (iPhone sales)\n\n📊 **High volume stocks:**\n- SPY, QQQ, MSFT showing unusual activity",
  "pe": "P/E Ratio (Price-to-Earnings) explained:\n\n📚 **Definition:**\nP/E = Stock Price ÷ Earnings Per Share\n\n💡 **What it means:**\n- Higher P/E = More expensive relative to earnings\n- Lower P/E = Potentially undervalued\n- Compare within same industry\n\n🎯 **Example:**\nIf a stock trades at $100 and earns $5 per share, P/E = 20x"
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('analyze') || input.includes('analysis')) {
      return SAMPLE_RESPONSES.analyze;
    } else if (input.includes('market') || input.includes('outlook')) {
      return SAMPLE_RESPONSES.market;
    } else if (input.includes('trending') || input.includes('hot') || input.includes('popular')) {
      return SAMPLE_RESPONSES.trending;
    } else if (input.includes('p/e') || input.includes('ratio')) {
      return SAMPLE_RESPONSES.pe;
    } else if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm here to help you with your trading and investment questions. What would you like to know about the markets today?";
    } else if (input.includes('portfolio')) {
      return "I can help you analyze your portfolio! Based on your current holdings, here are some insights:\n\n📊 **Portfolio Health:**\n- Diversification: Good across sectors\n- Risk level: Moderate\n- Suggested rebalancing: Consider reducing tech exposure\n\nWould you like me to dive deeper into any specific holdings?";
    } else if (input.includes('buy') || input.includes('sell')) {
      return "⚠️ **Important:** I can provide analysis and insights, but I cannot give specific buy/sell recommendations. \n\nHowever, I can help you:\n- Analyze stock fundamentals\n- Review technical indicators\n- Understand market conditions\n- Explain risk factors\n\nWhat specific stock would you like me to analyze?";
    } else {
      return "I understand you're asking about: \"" + userInput + "\"\n\nI can help you with:\n🔍 Stock analysis and research\n📈 Market trends and insights\n💡 Trading education\n📊 Portfolio optimization\n\nCould you be more specific about what you'd like to know?";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const quickActions = [
    { icon: TrendingUp, label: "Market Analysis", query: "What's the current market outlook?" },
    { icon: BarChart3, label: "Stock Screener", query: "Show me trending stocks today" },
    { icon: Target, label: "Portfolio Review", query: "Analyze my portfolio performance" },
    { icon: Lightbulb, label: "Trading Tips", query: "Give me some trading tips for beginners" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
          AI Trading Assistant
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Get instant insights, analysis, and answers to your trading questions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => sendMessage(action.query)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">{action.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">StockAI Assistant</CardTitle>
                <CardDescription className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              24/7 Available
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={
                      message.sender === 'user' 
                        ? 'bg-slate-600 text-white' 
                        : 'bg-blue-600 text-white'
                    }>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="flex flex-wrap gap-2 mt-4">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about stocks, market trends, or trading strategies..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={!inputMessage.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-slate-500 mt-2">
            💡 Try asking: "Analyze AAPL", "What's trending?", or "Explain technical analysis"
          </p>
        </div>
      </Card>
    </div>
  );
}
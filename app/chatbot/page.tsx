"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, TrendingUp, BarChart3, Target, Lightbulb, Clock, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: "Hello! I'm your AI trading assistant. I can help you with stock analysis, market insights, trading strategies, and answer questions about your portfolio. What would you like to know?",
    sender: 'bot',
    timestamp: new Date().toISOString(),
    suggestions: ['Analyze AAPL stock', "What's the market outlook?", 'Show me trending stocks', 'Explain P/E ratios'],
  },
];

const SAMPLE_RESPONSES: Record<string, string> = {
  analyze: "Based on current market data, here's my analysis:\n\n**📈 Technical Analysis:**\n- RSI: 65 (Slightly overbought)\n- Moving averages show bullish trend\n- Volume is above average\n\n**💡 Recommendation:** Consider taking profits if you're long, or wait for a pullback before entering new positions.",
  market: "Current market conditions:\n\n**🌍 Market Overview:**\n- S&P 500: +0.8% today\n- Tech sector leading gains\n- Low volatility environment\n\n**⚠️ Key factors to watch:**\n- Federal Reserve policy decisions\n- Earnings season results\n- Geopolitical developments",
  trending: "Here are today's trending stocks:\n\n**🔥 Top Movers:**\n1. NVDA: +5.2% (AI chip demand)\n2. TSLA: +3.8% (Production update)\n3. AAPL: +2.1% (iPhone sales)\n\n**📊 High volume stocks:** SPY, QQQ, MSFT showing unusual activity",
  pe: "**P/E Ratio (Price-to-Earnings) explained:**\n\n**Definition:** P/E = Stock Price ÷ Earnings Per Share\n\n**What it means:**\n- Higher P/E = More expensive relative to earnings\n- Lower P/E = Potentially undervalued\n- Always compare within the same industry\n\n**Example:** If a stock trades at $100 and earns $5/share, P/E = 20x",
};

function generateBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('analyze') || lower.includes('analysis')) return SAMPLE_RESPONSES.analyze;
  if (lower.includes('market') || lower.includes('outlook')) return SAMPLE_RESPONSES.market;
  if (lower.includes('trending') || lower.includes('hot') || lower.includes('popular')) return SAMPLE_RESPONSES.trending;
  if (lower.includes('p/e') || lower.includes('ratio') || lower.includes('valuation')) return SAMPLE_RESPONSES.pe;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I'm here to help with your trading and investment questions. What would you like to know about the markets today?";
  if (lower.includes('portfolio')) return "Based on your current holdings, here are some insights:\n\n**📊 Portfolio Health:**\n- Diversification: Good across sectors\n- Risk level: Moderate\n- Suggested rebalancing: Consider reducing tech exposure\n\nWould you like me to dive deeper into any specific holdings?";
  if (lower.includes('buy') || lower.includes('sell')) return "⚠️ **Important:** I can provide analysis and insights, but I cannot give specific buy/sell recommendations.\n\nHowever, I can help you:\n- Analyze stock fundamentals\n- Review technical indicators\n- Understand market conditions\n- Explain risk factors\n\nWhat specific stock would you like me to analyze?";
  return `I can help with your question about "${input}".\n\n**I can assist with:**\n🔍 Stock analysis and research\n📈 Market trends and insights\n💡 Trading education\n📊 Portfolio optimization\n\nCould you be more specific about what you'd like to know?`;
}

const quickActions = [
  { icon: TrendingUp, label: 'Market Analysis', query: "What's the current market outlook?" },
  { icon: BarChart3, label: 'Trending Stocks', query: 'Show me trending stocks today' },
  { icon: Target, label: 'Portfolio Review', query: 'Analyze my portfolio performance' },
  { icon: Lightbulb, label: 'Trading Tips', query: 'Give me trading tips for beginners' },
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Simple markdown-like rendering: **bold**, newlines
  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex items-end gap-2 max-w-[85%]', isUser && 'flex-row-reverse')}>
        <Avatar className="w-7 h-7 flex-shrink-0 mb-1">
          <AvatarFallback className={cn('text-white text-xs', isUser ? 'bg-slate-600' : 'bg-gradient-to-br from-blue-500 to-purple-600')}>
            {isUser ? <User className="w-3.5 h-3.5" aria-hidden="true" /> : <Bot className="w-3.5 h-3.5" aria-hidden="true" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
          )}>
            {renderContent(message.content)}
          </div>
          <div className={cn('text-xs mt-1 text-slate-400 dark:text-slate-500', isUser && 'text-right')}>
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="AI is typing">
      <div className="flex items-end gap-2">
        <Avatar className="w-7 h-7">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            <Bot className="w-3.5 h-3.5" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
          <div className="flex gap-1" aria-hidden="true">
            {[0, 0.15, 0.3].map((delay, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: trimmed,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(trimmed),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 600);
  }, [isTyping]);

  const lastMessage = messages[messages.length - 1];
  const showSuggestions = lastMessage?.sender === 'bot' && lastMessage?.suggestions;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl">
            <MessageSquare className="w-6 h-6 text-blue-600" aria-hidden="true" />
          </div>
          AI Trading Assistant
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Get instant insights, analysis, and answers to your trading questions
        </p>
      </header>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {quickActions.map(({ icon: Icon, label, query }) => (
          <button
            key={label}
            onClick={() => sendMessage(query)}
            disabled={isTyping}
            aria-label={label}
            className={cn(
              'p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center',
              'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Icon className="w-6 h-6 mx-auto mb-1.5 text-blue-600" aria-hidden="true" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</p>
          </button>
        ))}
      </div>

      {/* Chat interface */}
      <Card className="flex flex-col" style={{ height: '580px' }}>
        {/* Chat header */}
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 py-3 px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">StockAI Assistant</CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Online
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Clock className="w-3 h-3" aria-hidden="true" />
              24/7 Available
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Suggestions */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pl-9">
                {lastMessage.suggestions!.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    disabled={isTyping}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600',
                      'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300',
                      'hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                      'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    aria-label={`Ask: ${s}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex-shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(inputMessage); }}
            className="flex gap-2"
            aria-label="Send a message"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about stocks, market trends, or strategies..."
              className="flex-1 rounded-xl"
              disabled={isTyping}
              aria-label="Message input"
              maxLength={500}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
              className="rounded-xl px-4"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>
          <div className="flex items-center gap-1.5 mt-2">
            <AlertCircle className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              For educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// GEMINI_API_KEY is now stored securely in Supabase Secrets as 'GEMINI_API_KEY'
// The frontend calls the 'chatbot-ai' Edge Function instead of Gemini directly.


const SYSTEM_CONTEXT = `You are DeviceX AI Assistant — a friendly, knowledgeable assistant for the DeviceX platform, a premium device explorer and comparison website. 

You help users with:
- Device recommendations (phones, laptops, tablets, watches, audio)
- Comparing specs between devices
- Understanding technical specifications (RAM, processor, display, battery, etc.)
- Finding devices within a budget
- General tech advice

Keep answers concise, helpful, and conversational. Use emojis occasionally to be friendly. 
If someone asks something unrelated to technology/devices, politely redirect them back to device-related topics.
Format lists with bullet points when comparing multiple items. Always sign off with enthusiasm!`;

const suggestions = [
  "Best phones under ₹30,000?",
  "Compare iPhone vs Android",
  "Best laptop for students?",
  "Top wireless earbuds 2024?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! I'm **DeviceX AI** ✨ Your personal tech assistant. Ask me anything about phones, laptops, tablets, or any gadget — I'm here to help!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatText = (text) => {
    // Bold **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-4 my-1 space-y-0.5">$1</ul>');
    // Line breaks
    formatted = formatted.replace(/\n(?!<\/?[ul|li])/g, '<br/>');
    return formatted;
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    setInput('');
    setShowSuggestions(false);

    const userMsg = { id: Date.now(), role: 'user', text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history — embed system context in first user turn
      const history = messages
        .filter((m) => m.role !== 'assistant' || m.id !== 1) // skip welcome msg
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }));

      // Prepend system context to the first user message
      const contextualMessage = history.length === 0
        ? `[Context: ${SYSTEM_CONTEXT}]\n\nUser: ${userText}`
        : userText;

      const contents = [
        ...(history.length === 0 ? [] : [{ role: 'user', parts: [{ text: `[Context: ${SYSTEM_CONTEXT}]\n\nUser: ${history[0]?.parts[0]?.text || userText}` }] }, ...history.slice(1)]),
        { role: 'user', parts: [{ text: contextualMessage }] },
      ];

      const { data, error } = await supabase.functions.invoke('chatbot-ai', {
        body: { 
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        }
      });

      if (error) throw error;
      const replyText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response. Please try again!";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: replyText, time: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: "⚠️ Oops! I'm having trouble connecting right now. Please check your connection and try again.",
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        text: "Hi! I'm **DeviceX AI** ✨ Your personal tech assistant. Ask me anything about phones, laptops, tablets, or any gadget — I'm here to help!",
        time: new Date(),
      },
    ]);
    setShowSuggestions(true);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open DeviceX AI Chat"
        className="chatbot-fab"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 0 rgba(37,99,235,0.4), 0 8px 32px rgba(37,99,235,0.4)',
          animation: isOpen ? 'none' : 'fabPulse 2.5s ease-in-out infinite',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 0 0 8px rgba(37,99,235,0.15), 0 12px 40px rgba(37,99,235,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 0 0 rgba(37,99,235,0.4), 0 8px 32px rgba(37,99,235,0.4)';
        }}
      >
        <div style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          {isOpen ? (
            <X size={24} color="white" />
          ) : (
            <MessageCircle size={26} color="white" />
          )}
        </div>
        {/* Notification dot */}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '12px',
            height: '12px',
            background: '#22c55e',
            borderRadius: '50%',
            border: '2px solid #0f172a',
            animation: 'dotBlink 1.5s ease-in-out infinite',
          }} />
        )}
      </button>

      {/* Chat Window */}
      <div
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          height: '560px',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(8, 15, 40, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.2))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          }}>
            <Bot size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
                DeviceX AI
              </span>
              <Sparkles size={13} color="#a78bfa" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                animation: 'dotBlink 1.5s ease-in-out infinite',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Online · Powered by Gemini</span>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Trash2 size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
                animation: 'msgSlide 0.3s ease',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                  : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {msg.role === 'user'
                  ? <User size={14} color="white" />
                  : <Bot size={14} color="white" />}
              </div>

              <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                      : 'rgba(255,255,255,0.06)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.92)',
                    fontSize: '13.5px',
                    lineHeight: '1.55',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: msg.role === 'user'
                      ? '0 4px 12px rgba(37,99,235,0.3)'
                      : '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                />
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', paddingInline: '4px' }}>
                  {formatTime(msg.time)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', animation: 'msgSlide 0.3s ease' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={14} color="white" />
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.5)',
                    animation: `typingDot 1.2s ease-in-out ${delay}s infinite`,
                    display: 'inline-block',
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          {showSuggestions && messages.length === 1 && (
            <div style={{ marginTop: '4px' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '8px', textAlign: 'center' }}>
                Try asking:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: '6px 11px',
                      borderRadius: '20px',
                      background: 'rgba(37,99,235,0.12)',
                      border: '1px solid rgba(37,99,235,0.3)',
                      color: 'rgba(147,197,253,0.9)',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(37,99,235,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(37,99,235,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(37,99,235,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any device..."
            rows={1}
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '10px 14px',
              color: 'white',
              fontSize: '13.5px',
              fontFamily: 'Inter, sans-serif',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5',
              maxHeight: '100px',
              overflowY: 'auto',
              transition: 'border-color 0.2s',
              scrollbarWidth: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(37,99,235,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: input.trim() && !isLoading
                ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: input.trim() && !isLoading ? '0 4px 12px rgba(37,99,235,0.35)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading) e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Send size={16} color={input.trim() && !isLoading ? 'white' : 'rgba(255,255,255,0.3)'} />
          </button>
        </div>

        {/* Powered by footer */}
        <div style={{
          padding: '6px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
            ✦ Powered by Google Gemini AI
          </span>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4), 0 8px 32px rgba(37,99,235,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(37,99,235,0), 0 8px 32px rgba(37,99,235,0.4); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes typingDot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

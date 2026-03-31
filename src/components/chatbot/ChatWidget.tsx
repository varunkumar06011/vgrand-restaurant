import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, RotateCcw, Smartphone, Clock, ChevronLeft, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { chatbotService, ChatMessage, ChatSession } from '@/services/chatbot';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SavedChat {
  id: string;
  timestamp: string;
  messages: ChatMessage[];
  session: ChatSession;
  summary: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot protection
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ChatSession>({ stage: 'idle', data: {} });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('vgrand_chat_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const currentSession = localStorage.getItem('vgrand_current_chat');
    if (currentSession) {
      const parsed = JSON.parse(currentSession);
      setMessages(parsed.messages);
      setSession(parsed.session);

      if (parsed.session.stage === 'awaiting_approval' && parsed.session.data?.reservation_id) {
        startApprovalSubscription(parsed.session.data.reservation_id);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('vgrand_current_chat', JSON.stringify({ messages, session }));
    }
  }, [messages, session]);

  // FIX: Critical Scroll-Lock & UI Freeze Cleanup
  // Radix UI Popovers/Dialogs can leave the body locked if their parent (ChatWidget) 
  // is unmounted (via AnimatePresence) before they finish their close lifecycle.
  useEffect(() => {
    if (!isOpen) {
      // Force release any locks when chatbot is closed
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
      setIsCalendarOpen(false);
    }

    return () => {
      // Final fallback on component unmount
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  const saveToHistory = () => {
    if (messages.length < 2) return;
    const summary = session.data?.basket?.length > 0
      ? `Booking: ${session.data.basket.length} items for ${session.data.num_people || '?'}`
      : messages[0]?.content.substring(0, 30) + "...";

    const newChat = { id: Date.now().toString(), timestamp: new Date().toLocaleString(), messages, session, summary };
    const newHistory = [newChat, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('vgrand_chat_history', JSON.stringify(newHistory));
  };

  const loadFromHistory = (chat: SavedChat) => {
    saveToHistory();
    setMessages(chat.messages);
    setSession(chat.session);
    setShowHistory(false);
    toast.success("Conversation restored");
    if (chat.session.stage === 'awaiting_approval' && chat.session.data?.reservation_id) {
      startApprovalSubscription(chat.session.data.reservation_id);
    }
  };

  const startApprovalSubscription = (reservationId: string) => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = chatbotService.subscribeToReservation(reservationId, (updatedRes: any) => {
      const status = (updatedRes.status || '').toLowerCase();

      if (status.includes('confirm') || status.includes('reject')) {
        const isApproved = status.includes('confirm');
        if (isApproved) {
          toast.success("SMS Notification Sent! 📱", { duration: 5000 });
        } else {
          toast.error("Reservation Update ❌");
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          type: 'notification',
          content: updatedRes.notification_payload?.body || (isApproved ? "Confirmed! ✅" : "Rejected ❌")
        }]);
        
        // Stop listening after a final status is received
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
      }
    });
  };

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    // Bot Honeypot Check
    if (honeypot.length > 0) {
      console.warn("Bot detected via honeypot trigger.");
      toast.error("Spam protection triggered. Please refresh.");
      return;
    }

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(textToSend, messages, session);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        options: response.options,
        type: response.type,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSession(response.state);

      // Halt if error
      if (response.type === 'error') {
        setIsLoading(false);
        return;
      }

      // Handle Automatic Payment Trigger
      if (response.state.stage === 'awaiting_payment') {
        handlePayment(response.state.data);
      }

      if (response.state.stage === 'awaiting_approval' && response.state.data?.reservation_id) {
        startApprovalSubscription(response.state.data.reservation_id);
      }
    } catch (error) {
      toast.error('Connection trouble. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const formatted = format(selectedDate, "PPP");
    handleSend(formatted);
  };

  const handlePayment = async (data: any) => {
    setIsLoading(true);
    try {
      const paymentData = await chatbotService.initiatePayment(data);
      const scriptRes = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptRes) {
        toast.error('Razorpay SDK failed. Check your internet.');
        return;
      }

      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: 'INR',
        name: 'V Grand Gourmet Guide',
        order_id: paymentData.order_id,
        handler: async () => {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: "done" }]);
          const response = await chatbotService.sendMessage("done", messages, session);
          setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: response.reply, options: response.options }]);
          setSession(response.state);
          if (response.state.data?.reservation_id) startApprovalSubscription(response.state.data.reservation_id);
        },
        prefill: { contact: data.phone },
        theme: { color: '#E11D48' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Payment window failed to open. Click the "Pay" button.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-[380px] h-[min(85vh,580px)] bg-[#1A1A1A] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl relative"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {showHistory ? (
                  <button onClick={() => setShowHistory(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <ChevronLeft size={18} />
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/10">
                    <img src="/chatbot-logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">
                    {showHistory ? 'History' : 'Gourmet Guide'}
                  </h3>
                  <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">
                    {showHistory ? `${history.length} Saved` : 'Restaurant AI'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!showHistory && (
                  <>
                    <button onClick={() => setShowHistory(true)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-500 transition-all">
                      <Clock size={16} />
                    </button>
                    <button onClick={() => { saveToHistory(); setMessages([]); setSession({ stage: 'idle', data: { basket: [] } }); localStorage.removeItem('vgrand_current_chat'); toast.success('New Chat Started'); }} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-500 transition-all">
                      <RotateCcw size={16} />
                    </button>
                  </>
                )}
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* History Overlay */}
            <AnimatePresence>
              {showHistory && (
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-x-0 bottom-0 top-[89px] bg-[#1A1A1A] z-20 flex flex-col p-6 space-y-4 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-white/20">
                      <Clock size={40} className="mb-4 opacity-10" />
                      <p className="text-sm">No past conversations yet.</p>
                    </div>
                  ) : (
                    history.map((chat) => (
                      <button key={chat.id} onClick={() => loadFromHistory(chat)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/[0.08] transition-all group">
                        <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{chat.timestamp}</p>
                        <p className="text-white/90 text-sm font-bold line-clamp-1">{chat.summary}</p>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col gap-2", msg.role === 'user' ? 'items-end' : 'items-start')}>
                  {msg.type === 'notification' ? (
                    <div className="w-full p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest"><Smartphone size={12} /> Official Confirmation</div>
                      <p className="text-white/90 text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  ) : (
                    <div className={cn("max-w-[80%] p-4 rounded-2xl text-sm", msg.role === 'user' ? 'bg-rose-500 text-white rounded-tr-none' : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none')}>
                      {msg.content}
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.options.map((opt) => {
                        const isPayment = opt.includes('Payment');
                        return (
                          <button
                            key={opt}
                            onClick={() => isPayment ? handlePayment(session.data) : handleSend(opt)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs transition-all font-bold flex items-center gap-2",
                              isPayment
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:scale-105"
                                : "bg-white/5 border border-white/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                            )}
                          >
                            {isPayment && <CreditCard size={12} />}
                            {session.stage === 'collecting_food_details' && !isPayment ? `[+] ${opt}` : opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 sm:p-6 bg-black/40 border-t border-white/10 shrink-0">
              {/* Bot Honeypot - Hidden from humans */}
              <input 
                type="text" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
                className="hidden" 
                autoComplete="off"
                tabIndex={-1}
              />
              <div className="relative flex items-center gap-2">
                {session?.stage === 'collecting_date' && (
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button 
                        onClick={() => setIsCalendarOpen(true)}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shrink-0 group"
                      >
                        <CalendarIcon size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10 shadow-2xl z-[10000]" align="start" side="top" sideOffset={12}>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                        className="bg-transparent text-white"
                        classNames={{
                          day_selected: "bg-rose-500 text-white hover:bg-rose-600 rounded-lg",
                          day_today: "border border-rose-500/50 text-rose-500 font-bold",
                          head_cell: "text-white/40 font-black uppercase text-[10px] tracking-widest p-2",
                          cell: "text-center text-sm p-1 relative",
                          day: "h-9 w-9 p-0 font-bold text-white/90 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder={isLoading ? "Processing..." : "Ask..."} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 sm:py-4 pl-4 sm:pl-6 pr-14 text-sm text-white focus:border-rose-500/50 transition-all font-sans" 
                  />
                  <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white"><Send size={18} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={() => {
          if (isOpen) {
            // Force unlock body styles before animation starts
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'auto';
            setIsCalendarOpen(false);
          }
          setIsOpen(!isOpen);
        }} 
        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1], boxShadow: ["0 20px 40px -15px rgba(225, 29, 72, 0.4)", "0 30px 60px -15px rgba(225, 29, 72, 0.6)", "0 20px 40px -15px rgba(225, 29, 72, 0.4)"] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
        className="w-16 h-16 bg-white rounded-[22px] flex items-center justify-center shadow-2xl border-2 border-white/20 overflow-hidden"
      >
        <img src="/chatbot-logo.png" alt="Chat" className="w-full h-full object-cover scale-110" />
      </motion.button>
    </div>
  );
};

export default ChatWidget;

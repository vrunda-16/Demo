import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am MindGuard AI, your supportive first-aid companion. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput("");
        setLoading(true);

        try {
            // Connect to the backend
            const response = await axios.post('http://localhost:8000/chat/message', {
                text: userMsg,
                sender: "user"
            });

            const { reply, escalation_alert, escalation_message } = response.data;

            if (escalation_alert) {
                setAlert(escalation_message);
            }

            setMessages(prev => [...prev, { text: reply, isBot: true }]);
        } catch (error) {
            console.error("Chat error", error);
            // Fallback response for offline demo
            let botReply = "I am a bit overwhelmed right now, but please remember I'm here to listen.";
            let isCritical = ["suicide", "die", "kill"].some(w => userMsg.toLowerCase().includes(w));

            if (isCritical) {
                botReply = "This sounds critical. Please reach out to emergency services (like 988) immediately. Your life is valuable.";
                setAlert("Immediate escalation required!");
            }
            setMessages(prev => [...prev, { text: botReply, isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn-primary animate-slide-up"
                    style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px', borderRadius: '50%', padding: 0, zIndex: 1000, boxShadow: '0 10px 25px rgba(79, 70, 229, 0.5)' }}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isOpen && (
                <div className="glass-panel animate-slide-up" style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '380px', height: '600px', display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(79, 70, 229, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>MindGuard Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    {alert && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.9)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                            <AlertTriangle size={18} />
                            {alert}
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                <div style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                    background: msg.isBot ? 'var(--glass-bg)' : 'var(--primary)',
                                    border: msg.isBot ? '1px solid var(--glass-border)' : 'none',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', padding: '0.8rem 1rem', borderRadius: '16px', background: 'var(--glass-bg)', fontSize: '0.9rem' }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                        />
                        <button type="submit" disabled={!input.trim()} style={{ background: 'var(--primary)', border: 'none', color: 'white', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', opacity: input.trim() ? 1 : 0.5 }}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;

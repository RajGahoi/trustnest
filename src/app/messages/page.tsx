import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { store } from '../../mock/store';
import { api } from '../../services/api';
import type { Message, Conversation } from '../../types';

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(store.getConversations());
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>(store.getMessages(selectedConvId));
  const [textInput, setTextInput] = useState('');

  const loadConversations = async () => {
    try {
      const convs = await api.getConversations();
      if (convs && convs.length > 0) {
        setConversations(convs);
        if (!selectedConvId) {
          setSelectedConvId(convs[0].id);
        }
      }
    } catch (e) {
      // Fallback to store
      setConversations(store.getConversations());
    }
  };

  const loadMessages = async (convId: string) => {
    if (!convId) return;
    try {
      const msgs = await api.getMessages(convId);
      if (msgs) setMessages(msgs);
    } catch (e) {
      setMessages(store.getMessages(convId));
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    }
  }, [selectedConvId]);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !selectedConvId) return;

    const sendingText = textInput.trim();
    setTextInput('');

    try {
      const newMsg = await api.sendMessage(selectedConvId, sendingText);
      setMessages(prev => [...prev, newMsg]);
    } catch (e) {
      store.sendMessage(selectedConvId, sendingText);
      setMessages([...store.getMessages(selectedConvId)]);
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">Verified Inbox & Messages</h1>
      </div>

      <div className="bg-white rounded-3xl border border-navy-900/10 shadow-trust grid grid-cols-1 md:grid-cols-12 min-h-[600px] overflow-hidden">
        {/* Conversations List */}
        <div className="md:col-span-4 border-r border-navy-900/10 bg-cream-50/50 p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-navy-700 mb-2">Active Conversations</div>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => {
                setSelectedConvId(conv.id);
                setMessages(store.getMessages(conv.id));
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                selectedConvId === conv.id
                  ? 'bg-navy-900 text-cream-50 border-orange-500 shadow-md'
                  : 'bg-white text-navy-900 border-navy-900/10 hover:border-navy-900/30'
              }`}
            >
              <img src={conv.otherParticipantAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">{conv.otherParticipantName}</span>
                  <span className="text-[10px] opacity-70 font-mono">{conv.lastMessageAt}</span>
                </div>
                <div className="text-[11px] truncate font-semibold mt-0.5">{conv.listingTitle}</div>
                <div className="text-xs opacity-80 truncate mt-1">{conv.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Messages Thread Pane */}
        <div className="md:col-span-8 flex flex-col justify-between p-6 bg-white">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-navy-900/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeConv.listingImage} alt="" className="w-12 h-10 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 truncate">{activeConv.listingTitle}</h3>
                    <div className="text-xs text-orange-500 font-extrabold">{activeConv.listingPrice} · {activeConv.otherParticipantName}</div>
                  </div>
                </div>

                <div className="px-3 py-1 bg-trust-green/10 text-trust-green font-bold text-xs rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Identity</span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 py-6 space-y-4 overflow-y-auto max-h-[400px]">
                {messages.map(msg => {
                  const isMe = msg.senderId === 'usr-curr-user';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3.5 rounded-2xl max-w-md text-xs font-medium ${
                        isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-cream-100 text-navy-900 rounded-bl-none border border-navy-900/10'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1">{msg.createdAt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-navy-900/10 flex items-center gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-cream-50 border border-navy-900/15 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="p-3 bg-orange-500 text-white rounded-2xl shadow-orange-glow hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center my-auto text-navy-700 text-sm font-bold">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

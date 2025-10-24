import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, User, Clock, MessageCircle, Shield } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: { id: 1, name: 'Alice (Frontend)', avatar: 'F' },
      text: 'Hey team, working on the dashboard UI today!',
      time: '10:30 AM',
      type: 'sent'
    },
    {
      id: 2,
      user: { id: 2, name: 'Bob (Backend)', avatar: 'B' },
      text: 'Sounds good! API endpoints are ready for integration.',
      time: '10:32 AM',
      type: 'received'
    },
    {
      id: 3,
      user: { id: 3, name: 'Diana (UI/UX)', avatar: 'U' },
      text: '@Alice, can you share the mockups for review?',
      time: '10:35 AM',
      type: 'received'
    },
    {
      id: 4,
      user: { id: 4, name: 'Frank (Graphics)', avatar: 'G' },
      text: 'Logo variations attached. Let me know preferences.',
      time: '10:38 AM',
      type: 'received'
    }
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [permission, setPermission] = useState(false);
  const [usersOnline, setUsersOnline] = useState(new Set());
  const messagesEndRef = useRef(null);

  const teams = [
    { id: 1, name: 'Alice (Frontend)', avatar: 'F', team: 'Developers' },
    { id: 2, name: 'Bob (Backend)', avatar: 'B', team: 'Developers' },
    { id: 3, name: 'Diana (UI/UX)', avatar: 'U', team: 'UI/UX Designers' },
    { id: 4, name: 'Eve (UI/UX)', avatar: 'E', team: 'UI/UX Designers' },
    { id: 5, name: 'Frank (Graphics)', avatar: 'G', team: 'Graphics Designers' },
    { id: 6, name: 'Grace (Graphics)', avatar: 'Gr', team: 'Graphics Designers' },
    { id: 7, name: 'Charlie (Frontend)', avatar: 'C', team: 'Developers' },
    { id: 8, name: 'David (Backend)', avatar: 'D', team: 'Developers' },
  ];

  const grantPermission = () => {
    setPermission(true);
    // Simulate online users
    setUsersOnline(new Set([1, 2, 3, 4]));
  };

  const selectUser = (user) => {
    setCurrentUser(user);
    if (!usersOnline.has(user.id)) {
      setUsersOnline(prev => new Set([...prev, user.id]));
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && currentUser && permission) {
      const msg = {
        id: messages.length + 1,
        user: currentUser,
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      // Simulate reply from another user after delay
      setTimeout(() => {
        const replyUser = teams.find(t => t.id !== currentUser.id && usersOnline.has(t.id));
        if (replyUser) {
          setMessages(prev => [...prev, {
            id: prev.length + 2,
            user: replyUser,
            text: 'Thanks for the update!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received'
          }]);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!permission) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Chat Access Restricted</h1>
          <p className="text-gray-600 mb-6">Manager permission is required to access team communications.</p>
          <button
            onClick={grantPermission}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Users size={20} /> Grant Permission (Manager)
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Team Members */}
      <div className="w-80 bg-white border-r shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle size={24} className="text-blue-600" />
            Team Chat
          </h2>
          <p className="text-sm text-gray-500">
            {usersOnline.size} online
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => selectUser(team)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentUser?.id === team.id
                  ? 'bg-blue-50 border-blue-200 border-2'
                  : usersOnline.has(team.id)
                  ? 'bg-green-50 hover:bg-green-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  currentUser?.id === team.id ? 'bg-blue-600' : 'bg-gray-400'
                }`}>
                  {team.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{team.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{team.team}</p>
                </div>
                {usersOnline.has(team.id) && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentUser && (
                <>
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{currentUser.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser.team}</p>
                  </div>
                </>
              )}
              {!currentUser && <h3 className="font-bold">Select a team member to start chatting</h3>}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                  msg.type === 'sent'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {msg.type === 'received' && (
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                      {msg.user.avatar}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{msg.user.name}</p>
                    <p className="text-xs opacity-70">{msg.time}</p>
                  </div>
                </div>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {currentUser ? (
          <div className="bg-white border-t p-4">
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-t p-4 text-center text-gray-500">
            Select a team member to chat
          </div>
        )}
      </div>
    </div>
    </AppLayout>
  );
};

export default Chat;
import React, { useState } from 'react';
import { Search, MessageSquare, Send, ArrowLeft, CheckCheck, Car, Shield, Circle } from 'lucide-react';

interface MessageItem {
  id: string;
  sender: string;
  avatar: string;
  tripSummary?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline?: boolean;
  history: Array<{ sender: string; text: string; isMe: boolean; time: string }>;
}

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<MessageItem | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  const [conversations, setConversations] = useState<MessageItem[]>([
    {
      id: 'chat-1',
      sender: 'Minh Tuấn (Tài xế)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      tripSummary: 'KTX Khu B, ĐHQG → Đại học CNTT UIT',
      lastMessage: 'Chào bạn, mình sẽ đón bạn tại cổng KTX Khu B lúc 07:25 nhé!',
      time: '07:18',
      unreadCount: 1,
      isOnline: true,
      history: [
        { sender: 'Minh Tuấn', text: 'Chào bạn, mình vừa nhận yêu cầu ghép chuyến của bạn!', isMe: false, time: '07:12' },
        { sender: 'Bạn', text: 'Dạ chào anh Tuấn, xe mình còn đủ chỗ không ạ?', isMe: true, time: '07:14' },
        { sender: 'Minh Tuấn', text: 'Xe 4 chỗ còn 2 ghế nữa em nhé, thoải mái lắm.', isMe: false, time: '07:15' },
        { sender: 'Minh Tuấn', text: 'Chào bạn, mình sẽ đón bạn tại cổng KTX Khu B lúc 07:25 nhé!', isMe: false, time: '07:18' }
      ]
    },
    {
      id: 'chat-2',
      sender: 'Nhóm xe UIT → Bến Thành',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      tripSummary: 'Chuyến chiều mai lúc 17:30',
      lastMessage: 'Lan Anh: Mọi người tập trung ở cổng A UIT nhé!',
      time: 'Hôm qua',
      unreadCount: 0,
      isOnline: false,
      history: [
        { sender: 'Nguyễn Hùng', text: 'Mai ai đi chung không mình còn 2 chỗ.', isMe: false, time: '14:20' },
        { sender: 'Bạn', text: 'Em đăng ký 1 chỗ nhé anh!', isMe: true, time: '14:25' },
        { sender: 'Lan Anh', text: 'Mọi người tập trung ở cổng A UIT nhé!', isMe: false, time: '18:30' }
      ]
    },
    {
      id: 'chat-3',
      sender: 'Cogo Hỗ trợ CSKH',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      tripSummary: 'Hỗ trợ chuyến đi & an toàn',
      lastMessage: 'Cảm ơn bạn đã tin tưởng dịch vụ đi chung Cogo.',
      time: '18 Th08',
      unreadCount: 0,
      isOnline: true,
      history: [
        { sender: 'Cogo CSKH', text: 'Chào mừng bạn đến với Cogo Đi Chung! Nếu cần trợ giúp bạn có thể nhắn tại đây.', isMe: false, time: '09:00' },
        { sender: 'Cogo CSKH', text: 'Cảm ơn bạn đã tin tưởng dịch vụ đi chung Cogo.', isMe: false, time: '09:01' }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(c => 
    c.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.tripSummary && c.tripSummary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const newMsg = {
      sender: 'Bạn',
      text: inputMessage.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...activeChat.history, newMsg];
    const updatedChat = {
      ...activeChat,
      history: updatedHistory,
      lastMessage: `Bạn: ${inputMessage.trim()}`,
      time: 'Vừa xong',
      unreadCount: 0
    };

    setActiveChat(updatedChat);
    setConversations(prev => prev.map(c => c.id === activeChat.id ? updatedChat : c));
    setInputMessage('');
  };

  const handleOpenChat = (conv: MessageItem) => {
    // Clear unread
    const cleared = { ...conv, unreadCount: 0 };
    setActiveChat(cleared);
    setConversations(prev => prev.map(c => c.id === conv.id ? cleared : c));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9ff] flex flex-col relative font-sans text-[#141b2c] select-none h-full pb-20 sm:pb-24">
      
      {/* Top Header */}
      <div className="px-5 pt-6 pb-3 bg-[#f9f9ff] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-[#141b2c] tracking-tight">
            Tin nhắn
          </h1>
          <div className="w-8 h-8 rounded-full bg-[#e6f2ec] text-[#006b47] flex items-center justify-center font-bold text-[12px]">
            {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#8a9490] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện, chuyến đi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#eceeed] rounded-[16px] text-[13.5px] outline-none focus:border-[#006b47] text-[#141b2c] placeholder:text-[#8a9490] shadow-2xs transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 pt-1 space-y-2.5 flex-1">
        {filteredConversations.length === 0 ? (
          <div className="py-16 text-center text-[#8a9490]">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-[14px] font-medium">Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => handleOpenChat(conv)}
              className="bg-white rounded-[20px] p-3.5 border border-[#eceeed] shadow-[0_2px_8px_rgba(20,27,44,0.03)] hover:border-[#ccdcd4] active:scale-[0.99] transition-all cursor-pointer flex items-center gap-3.5"
            >
              {/* Avatar with online indicator */}
              <div className="relative shrink-0">
                <img 
                  src={conv.avatar} 
                  alt={conv.sender}
                  className="w-12 h-12 rounded-full object-cover border border-[#eceeed]"
                />
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00875a] border-2 border-white rounded-full" />
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="text-[14.5px] font-bold text-[#141b2c] truncate">
                    {conv.sender}
                  </h3>
                  <span className="text-[11.5px] text-[#8a9490] shrink-0 font-medium">
                    {conv.time}
                  </span>
                </div>

                {conv.tripSummary && (
                  <p className="text-[11px] text-[#006b47] font-semibold truncate mb-0.5">
                    {conv.tripSummary}
                  </p>
                )}

                <p className="text-[12.5px] text-[#5c6763] truncate leading-snug">
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread Pill */}
              {conv.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-[#006b47] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Active Chat Window Sheet / Full Overlay */}
      {activeChat && (
        <div className="absolute inset-0 z-50 bg-[#141b2c]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div 
            onClick={() => setActiveChat(null)}
            className="flex-1 w-full"
          />
          <div className="w-full h-[90%] bg-white rounded-t-[28px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Chat Header */}
            <div className="px-4 py-3.5 bg-white border-b border-[#eceeed] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#141b2c] active:scale-95 transition-all shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <h3 className="font-bold text-[15px] text-[#141b2c] truncate leading-tight">
                    {activeChat.sender}
                  </h3>
                  <p className="text-[11.5px] text-[#006b47] font-medium truncate">
                    {activeChat.tripSummary || 'Đang hoạt động'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9ff]">
              <div className="text-center my-1">
                <span className="text-[11px] bg-gray-200/70 text-[#6f7a76] px-2.5 py-0.5 rounded-full font-medium">
                  Bắt đầu cuộc trò chuyện
                </span>
              </div>

              {activeChat.history.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  {!msg.isMe && (
                    <span className="text-[11px] text-[#8a9490] font-semibold mb-1 ml-1">
                      {msg.sender}
                    </span>
                  )}
                  <div 
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-[18px] text-[13.5px] leading-relaxed shadow-2xs ${
                      msg.isMe 
                        ? 'bg-[#006b47] text-white rounded-br-xs' 
                        : 'bg-white text-[#141b2c] border border-[#eceeed] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9aa4a0] mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                    {msg.isMe && <CheckCheck className="w-3 h-3 text-[#006b47]" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form 
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-[#eceeed] flex items-center gap-2 shrink-0"
            >
              <input 
                type="text"
                placeholder="Nhập nội dung tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#f0f2f1] text-[13.5px] px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#006b47] text-[#141b2c] placeholder:text-[#8a9490]"
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#006b47] hover:bg-[#00875a] text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

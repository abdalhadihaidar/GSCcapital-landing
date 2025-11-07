'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Phone, Building2, Calendar, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const toggleReadStatus = async (messageId: string, isRead: boolean) => {
    try {
      // This would need an update endpoint in the API
      // For now, we'll just update the local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: !isRead } : msg
        )
      );
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
          <p className="text-slate-600">
            Manage incoming contact messages 
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No messages yet</h3>
                <p className="text-slate-600">Contact messages will appear here when visitors submit the form.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={!message.isRead ? 'border-blue-200 bg-blue-50/30' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {message.name}
                        {!message.isRead && (
                          <Badge className="bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </span>
                        {message.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {message.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(message.createdAt)}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReadStatus(message.id, message.isRead)}
                    >
                      {message.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-700 whitespace-pre-wrap">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
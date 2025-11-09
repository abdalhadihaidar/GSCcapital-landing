'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Phone, Building2, Calendar, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAdminTranslations } from '@/hooks/use-admin-translations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const { t } = useAdminTranslations();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(t.saveError);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (messageId: string, isRead: boolean) => {
    setUpdatingStatus(messageId);
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !isRead })
      });

      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isRead: !isRead } : msg
          )
        );
        toast.success(isRead ? t.markAsUnread : t.markAsRead);
      } else {
        throw new Error('Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error(t.saveError);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setMessageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;

    setIsDeleting(messageToDelete);
    try {
      const response = await fetch(`/api/contact/${messageToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(t.deleteSuccess);
        await fetchMessages();
        setDeleteDialogOpen(false);
        setMessageToDelete(null);
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(t.deleteError);
    } finally {
      setIsDeleting(null);
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.deleting}
                </>
              ) : (
                t.delete
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.messages}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t.messages} Management
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {unreadCount} {t.unread}
              </Badge>
            )}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.loading}
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">{t.noData}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t.messages.toLowerCase()} will appear here when visitors submit the form.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card 
              key={message.id} 
              className={`dark:bg-slate-800 dark:border-slate-700 ${
                !message.isRead ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                        {message.name}
                        {!message.isRead && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1 dark:text-slate-400">
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
                      disabled={updatingStatus === message.id}
                    >
                      {updatingStatus === message.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : message.isRead ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteClick(message.id)}
                      disabled={isDeleting === message.id}
                    >
                      {isDeleting === message.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}